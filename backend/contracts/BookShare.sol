// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// ERC-721 token representing a Book Share
contract BookShare is ERC721, Ownable {
    using Strings for uint;
    Counters.Counter private tokenIds;

    address public author; // Address of the author who created the Book Share
    uint256 public totalShares; // Total number of Book Shares
    uint256 public sharesAvailable; // Number of Book Shares still available
    uint256 public pricePerShare; // Price of each Book Share in Wei
    uint256 public rightsPercentage; // Percentage of rights ceded by the author
    uint256 public marketFeePercentage; // Platform fee percentage for primary and secondary market
    uint256 public distributionFeePercentage; // Platform fee percentage for royalty distribution
    string public baseURI; // Link ipfs://CID/

    event BookShareSold(address indexed buyer, uint256 amount);
    event RoyaltiesDistributed();

    // Constructor to initialize the Book Share
    constructor(
        string memory _name,
        string memory _symbol,
        address _author,
        uint256 _rightsPercentage,
        uint256 _totalShares,
        uint256 _pricePerShare,
        string memory _baseURI
    ) Ownable(msg.sender) ERC721(_name, _symbol) {
        author = _author;
        rightsPercentage = _rightsPercentage;
        totalShares = _totalShares;
        pricePerShare = _pricePerShare;
        sharesAvailable = totalShares;
        baseURI = _baseURI;

        marketFeePercentage = 500; // 5% market fee
        distributionFeePercentage = 300; // 3% distribution fee
    }

    // Function to get a tokenURI
    function tokenURI(uint _tokenId) public view virtual override(ERC721) returns(string memory) {
        // 0 => ipfs://CID/0.json
        // 1 => ipfs://CID/1.json
       _requireOwned(_tokenId);

        // "ipfs://CID/" + _tokenId + ".json"
        return bytes(baseURI).length > 0 ? string.concat(baseURI, _tokenId.toString(), ".json") : "";
    }

    // Function to get the bookshare URI
    function bookshareURI() public view returns(string memory) {
         // "ipfs://CID/metadata.json"
        return bytes(baseURI).length > 0 ? string.concat(baseURI, "metadata.json") : "";
    }


    // Function to buy Book Shares
    function buyShares(uint256 _quantity) external payable {
        require(_quantity > 0, "Quantity must be greater than 0");
        require(sharesAvailable >= _quantity, "Not enough Book Shares available");

        uint256 nextId = tokenIds.current();

        // Calculate total cost with market fees
        uint256 marketFee = (_quantity * pricePerShare * marketFeePercentage) / 10000;
        uint256 totalCost = (_quantity * pricePerShare) + marketFee;
        require(msg.value >= totalCost, "Insufficient funds");

        // Transfer market fees to platform address
        (bool success,) = owner().call{value: marketFee}("");
        require(success, "Failed to transfer fee");

        // Mint new Book Shares to the buyer
        for (uint256 i = 1; i <= _quantity; i++) {
            --sharesAvailable;
            _safeMint(msg.sender, nextId);
            tokenIds.increment();
        }

        // Emit an event for the Book Shares being sold
        emit BookShareSold(msg.sender, _quantity);
    }

    // Function to distribute royalties to all holders
    function distributeRoyalties(uint256 _revenue) external onlyOwner {
        require(_revenue > 0, "Revenue must be greater than 0");

        // Calculate royalties based on the author's percentage ceded
        uint256 royalties = _revenue * rightsPercentage;

        // Calculate distribution fee
        uint256 distributionFee = (royalties * distributionFeePercentage) / 10000;

        // Transfer distribution fee to platform address (replace with your platform's address)
        (bool successFee,) = owner().call{value: distributionFee}("");
        require(successFee, "Failed to transfer fee");

        // Calculate remaining royalties
        uint256 remainingRoyalties = royalties - distributionFee;

        // Distribute remaining royalties proportionally to all holders
        for (uint256 i = 0; i < totalShares; i++) {
            address holder = ownerOf(i);

            // Calculate holder's share of royalties
            uint256 holderShare = (balanceOf(holder) * remainingRoyalties) / (totalShares - sharesAvailable);

            // Transfer royalties to the holder
            (bool successRoyalties,) = holder.call{value: holderShare}("");
            require(successRoyalties, "Failed to transfer royalties");
        }

        // Emit an event for royalties distribution
        emit RoyaltiesDistributed();
    }
}