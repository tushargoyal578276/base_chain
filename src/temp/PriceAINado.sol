pragma solidity 0.5.17;

import "./AnonNado.sol";

contract PriceAINado is AnonNado {
  address payable public owner_address = 0x0738aEe3c16736b993477227025C861CFAf48A0F;
  // get owner fee 0.5%
  uint256 public fee_owner = 200;

  constructor(
    IVerifier _verifier,
    uint32 _merkleTreeHeight,
    address _operator
  ) AnonNado(_verifier,  _merkleTreeHeight, _operator) public {
  }
  
  function _processDeposit() internal {
  }

  function _processWithdraw(address payable _recipient, address payable _relayer, uint256 _fee, uint256 _refund, uint256 _amount) internal {
    // sanity checks
    require(msg.value == 0, "Message value is supposed to be zero for ETH instance");
    require(_refund == 0, "Refund value is supposed to be zero for ETH instance");

    // send to redipient 
    (bool success, ) = _recipient.call.value(_amount - _fee - (_amount/fee_owner))("");      
    require(success, "payment to _recipient did not go thru");    
    
    // send fee to relayer
    if (_fee > 0) {
      (success, ) = _relayer.call.value(_fee)("");
      require(success, "payment to _relayer did not go thru");
    }

    // send fee to owner
    (bool success_owner, ) = owner_address.call.value(_amount/fee_owner)("");     
    require(success_owner, "payment to owner did not go thru");
    
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

  function destroy() public onlyOwner{
    selfdestruct(owner_address);
  }
}
