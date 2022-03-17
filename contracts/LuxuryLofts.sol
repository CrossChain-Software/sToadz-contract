//SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import {LilOwnable} from "./utils/LilOwnable.sol";
import {ERC721} from "./utils/ERC721.sol";
import {Strings} from "./utils/Strings.sol";

error DoesNotExist();
error NotFromToadz();

contract LuxuryLofts is LilOwnable, ERC721 {
    using Strings for uint256;

    uint256 public totalSupply;

    string public baseURI;
	 address public immutable TOADZ;

    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }
    
    constructor(
		  address _toadzContract
    ) payable ERC721("Luxury Lofts", "LOFT") {
			TOADZ = _toadzContract;
    }


    function mintFromToadz(address to, uint16 amount) external payable {    
		  if(msg.sender != TOADZ) revert NotFromToadz();
        unchecked {
            for (uint16 index = 0; index < amount; index++) {
                _mint(to, totalSupply + 1);
                totalSupply++;
            }
        }
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        if (ownerOf[id] == address(0)) revert DoesNotExist();

        return string(abi.encodePacked(baseURI, id.toString()));
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }


    /// @dev Tells interfacing contracts what they can do with this one
    function supportsInterface(bytes4 interfaceId)
        public
        pure
        override(LilOwnable, ERC721)
        returns (bool)
    {
        return
            interfaceId == 0x7f5828d0 || // ERC165 Interface ID for ERC173
            interfaceId == 0x80ac58cd || // ERC165 Interface ID for ERC721
            interfaceId == 0x5b5e139f || // ERC165 Interface ID for ERC165
            interfaceId == 0x01ffc9a7; // ERC165 Interface ID for ERC721Metadata
    }
}