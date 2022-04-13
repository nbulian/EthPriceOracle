//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "./CallerContractInterface.sol";
contract EthPriceOracle is Ownable {
  uint256 private _randNonce = 0;
  uint256 private _modulus = 1000;
  mapping(uint256=>bool) _pendingRequests;
  event GetLatestEthPriceEvent(address callerAddress, uint256 id);
  event SetLatestEthPriceEvent(uint256 ethPrice, address callerAddress);
  function getLatestEthPrice() public returns (uint256) {
    _randNonce++;
    uint256 id = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _randNonce))) % _modulus;
    _pendingRequests[id] = true;
    emit GetLatestEthPriceEvent(msg.sender, id);
    return id;
  }
  function setLatestEthPrice(uint256 _ethPrice, address _callerAddress,   uint256 _id) public onlyOwner {
    require(_pendingRequests[_id], "This request is not in my pending list.");
    delete _pendingRequests[_id];
    CallerContractInterface callerContractInstance;
    callerContractInstance = CallerContractInterface(_callerAddress);
    callerContractInstance.callback(_ethPrice, _id);
    emit SetLatestEthPriceEvent(_ethPrice, _callerAddress);
  }
}
