//SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import {Strings} from "./utils/Strings.sol";
import {LilOwnable} from "./utils/LilOwnable.sol";
import {ERC721} from "./utils/ERC721.sol";
import {ERC20} from "./utils/ERC20.sol";
import {SafeTransferLib} from "./utils/SafeTransferLib.sol";

/*

    _____               _     
 __|_   _|__   __ _  __| |____
/ __|| |/ _ \ / _` |/ _` |_  /
\__ \| | (_) | (_| | (_| |/ / 
|___/|_|\___/ \__,_|\__,_/___|                       


*/

error DoesNotExist();
error NoTokensLeft();
error NotEnoughETH();
error TooManyMintAtOnce();
error MintNotStarted();
error EmptyBalance();
error CannotMintZero();

interface AirdropNft {
	function mintFromToadz(address to, uint16 amount) external payable;
}

contract sToadz is LilOwnable, ERC721 {
    using Strings for uint256;

	uint256 public constant publicMintMaxSupply = 6000;
    uint256 public constant mintPrice = 1200 ether;
    address public constant sRibbits = 0x399E279c814a3100065fceaB8CbA1aB114805344;
    uint256 public maxPublicMintAmount = 50;

    bool public mintStarted = false;

    uint256 public totalSupply;
	uint256 public publicMintSupply;

    string public baseURI;

    address[5] public _royaltyAddresses; 

	AirdropNft public SongBirdCity;
	AirdropNft public LuxuryLoft;
	 
	address[][] private airdropAddresses;
	uint256[][] private airdropAmounts;
	uint256 private airdropIndex;	 

    mapping(address => uint256) private _royaltyShares;

    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

    constructor() payable ERC721("sToadz", "STOADZ") {

        address[5] memory _contributorAddresses = [ 
            0xb20F2a4601aED75B886CC5B84E28a0D65a7Bfd48, 
            0x90ca2B438482f2b205dA814B94b4758c3a229541, 
            0x8e23A0C18D2Fd631eFA838aCC1DfBecbbdB3ADD9, 
            0xc8d015b94a3Fb41DC13d6a9573bb454300023A94, 
            0x5B588e36FF358D4376A76FB163fd69Da02A2A9a5
        ];

        _royaltyAddresses[0] = _contributorAddresses[0]; 
        _royaltyAddresses[1] = _contributorAddresses[1];
        _royaltyAddresses[2] = _contributorAddresses[2];
        _royaltyAddresses[3] = _contributorAddresses[3]; 
        _royaltyAddresses[4] = _contributorAddresses[4];

        _royaltyShares[_royaltyAddresses[0]] = 498;
        _royaltyShares[_royaltyAddresses[1]] = 581;
        _royaltyShares[_royaltyAddresses[2]] = 581;
        _royaltyShares[_royaltyAddresses[3]] = 8090;
        _royaltyShares[_royaltyAddresses[4]] = 250;		  
    }


	 /* Split the airdrop to avoid exceeding the block gas limit
	   Call this multiple times to get through the airdrop indices */

	function airdrop() external onlyOwner {
        address[] memory recipients = airdropAddresses[airdropIndex];
        uint256[] memory numAllowed = airdropAmounts[airdropIndex];
		
	    uint256 length = recipients.length;
        for (uint256 i = 0; i < length; i++) {
                address recipient = recipients[i];
                uint256 numToMint = numAllowed[i];
                
                for(uint256 j=0; j <numToMint; j++) {
                    _mint(recipient, totalSupply + 1);
                    totalSupply++;
                }
        }
        
        airdropIndex++;
    }

	function setAirdropInfo(address[][] memory _airdropAddresses, uint256[][] memory _airdropAmounts) external onlyOwner {
        airdropAddresses = _airdropAddresses;
        airdropAmounts = _airdropAmounts;
	}
	 

    function mint(uint16 amount) external payable {
		if(amount == 0) revert CannotMintZero();
        if (publicMintSupply + amount > publicMintMaxSupply) revert NoTokensLeft();
        if (!mintStarted) revert MintNotStarted();
        if (msg.value < amount * mintPrice) revert NotEnoughETH();
        if (amount > maxPublicMintAmount) revert TooManyMintAtOnce();

        unchecked {
            for (uint16 index = 0; index < amount; index++) {
                _mint(msg.sender, totalSupply + 1);
                totalSupply++;
					 publicMintSupply++;
            }
        }
		uint256 amountToSend = uint256(amount) * 3500 ether;
        SafeTransferLib.safeTransfer(ERC20(sRibbits), msg.sender, amountToSend);
        SongBirdCity.mintFromToadz(msg.sender, amount);
        LuxuryLoft.mintFromToadz(msg.sender, amount);
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function tokenURI(uint256 id) public override view returns (string memory) {
        if (ownerOf[id] == address(0)) revert DoesNotExist();

        return string(abi.encodePacked(baseURI, id.toString(), ".json"));
    }

    function startMint() public onlyOwner {
        mintStarted = true;
    }

    function pauseMint() public onlyOwner {
        mintStarted = false;
    }

    function withdraw() external {
        if (address(this).balance == 0) revert EmptyBalance();
        uint256 balance = address(this).balance;

        for (uint256 i = 0; i < _royaltyAddresses.length; i++) {
            payable(_royaltyAddresses[i]).transfer(
                balance / 10000 * _royaltyShares[_royaltyAddresses[i]]
            );
        }
    }

    function setSongBirdCity(address _songBirdCityAddress) external onlyOwner {
        SongBirdCity = AirdropNft(_songBirdCityAddress);
    }

    function setLofts(address _loftAddress) external onlyOwner {
        LuxuryLoft = AirdropNft(_loftAddress);
    }

    function setMaxPublicMintAmount(uint256 _maxPublicMintAmount) external onlyOwner {
        maxPublicMintAmount = _maxPublicMintAmount;
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