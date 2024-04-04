// https://Smashcash.io
/*
* Smashcash
*/

pragma solidity 0.5.17;

import "./Smashnado.sol";

contract ERC20Smashnado is Smashnado {
  address public token;

  address payable public owner_address = 0x9259950b5C9Bc3f4bf95a04be5eB652DCFB8790C;
  // get owner fee 0.5%
  uint256 public fee_owner = 200; 

  constructor(
    IVerifier _verifier,
    uint256 _denomination,
    uint32 _merkleTreeHeight,
    address _operator,
    address _token
  ) Smashnado(_verifier, _denomination, _merkleTreeHeight, _operator) public {
    token = _token;
  }
  
  function _processDeposit() internal {
    require(msg.value == 0, "ETH value is supposed to be 0 for ERC20 instance");
    _safeErc20TransferFrom(msg.sender, address(this), denomination);
  }

  function _processWithdraw(address payable _recipient, address payable _relayer, uint256 _fee, uint256 _refund) internal {
    require(msg.value == _refund, "Incorrect refund amount received by the contract");

     _safeErc20Transfer(_recipient, denomination - _fee - (denomination/fee_owner));
    if (_fee > 0) {
      _safeErc20Transfer(_relayer, _fee);
    }

    if (_refund > 0) {
      (bool success, ) = _recipient.call.value(_refund)("");
      if (!success) {
        // let's return _refund back to the relayer
        _relayer.transfer(_refund);
      }
    }

    // transfer fee to owner
    _safeErc20Transfer(owner_address, (denomination/fee_owner));
  }

  function _safeErc20TransferFrom(address _from, address _to, uint256 _amount) internal {
    (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd /* transferFrom */, _from, _to, _amount));
    require(success, "not enough allowed tokens");

    // if contract returns some data lets make sure that is `true` according to standard
    if (data.length > 0) {
      require(data.length == 32, "data length should be either 0 or 32 bytes");
      success = abi.decode(data, (bool));
      require(success, "not enough allowed tokens. Token returns false.");
    }
  }

  function _safeErc20Transfer(address _to, uint256 _amount) internal {
    (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb /* transfer */, _to, _amount));
    require(success, "not enough tokens");

    // if contract returns some data lets make sure that is `true` according to standard
    if (data.length > 0) {
      require(data.length == 32, "data length should be either 0 or 32 bytes");
      success = abi.decode(data, (bool));
      require(success, "not enough tokens. Token returns false.");
    }
  }

  function setCollectionAddress(address payable _collector) public onlyOwner {
    owner_address = _collector;
  }

  function setTransferFee(uint256 _transferFee) public onlyOwner {
    fee_owner = _transferFee;
  }

  function getCollectionAddress() public view returns(address payable) {
    return owner_address;
  }

  function getTransferFee() public view returns(uint256) {
    return fee_owner;
  }
}
