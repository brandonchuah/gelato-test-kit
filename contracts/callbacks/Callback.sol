// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract Callback {
    mapping(address => uint256) public count;
    mapping(address => uint256) public lastExecuted;

    function increaseCount() external {
        count[msg.sender] += 1;
        lastExecuted[msg.sender] = block.timestamp;
    }

    function increaseCountStrict(uint256 _interval) external {
        uint256 _lastExecuted = lastExecuted[msg.sender];

        require(
            block.timestamp > _lastExecuted + _interval,
            "Callback: interval not elapsed"
        );

        count[msg.sender] += 1;
        lastExecuted[msg.sender] = block.timestamp;
    }
}
