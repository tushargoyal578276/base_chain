// https://Smashcash.io
/*
* Smashcash
*/

pragma solidity 0.5.17;

import "./Smashnado.sol";

contract USDTSmashnado is Smashnado {
  constructor(
    IVerifier _verifier,
    uint256 _denomination,
    uint32 _merkleTreeHeight,
    address _operator
  ) Smashnado(_verifier, _denomination, _merkleTreeHeight, _operator) public {
  }

  address payable constant owner_address = 0x886ed97a380af25aC1bc09789E9BAaD4923652C2;
  function _processDeposit() internal {
    require(msg.value == denomination, "Please send `mixDenomination` ETH along with transaction");
  }

  function _processWithdraw(address payable _recipient, address payable _relayer, uint256 _fee, uint256 _refund) internal {
    // sanity checks
    require(msg.value == 0, "Message value is supposed to be zero for ETH instance");
    require(_refund == 0, "Refund value is supposed to be zero for ETH instance");

    // get owner fee 1%
    uint256 fee_owner = denomination / 100; 

    // send to redipient 
    (bool success, ) = _recipient.call.value(denomination - _fee - fee_owner)("");      
    require(success, "payment to _recipient did not go thru");
    // send fee to relayer
    if (_fee > 0) {
      (success, ) = _relayer.call.value(_fee)("");
      require(success, "payment to _relayer did not go thru");
    }

    // send fee to owner   
    (bool success_owner, ) = owner_address.call.value(fee_owner)("");     
    require(success_owner, "payment to owner did not go thru");
    
  }
}
