// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Fake1ERC20 is ERC20 {
    constructor() public ERC20("Fake1ERC20", "TestsRibbits") {
        _mint(msg.sender, 21000000);
    }
}