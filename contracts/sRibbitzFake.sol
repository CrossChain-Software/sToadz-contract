//SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import {LilOwnable} from "./utils/LilOwnable.sol";
import {ERC20} from "./utils/ERC20.sol";

contract sRibbitzTest is LilOwnable, ERC20 {
	constructor() ERC20("sRibbitz Fake", "FSRIBZ", 18) {
	}

	
    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

	function ownerMint(uint256 _amount) external onlyOwner {
		_mint(msg.sender, _amount);
	}
}