// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BookShare
 * @dev ERC-721 token representing a Book Share.
 * @author Julien Aufils
 */
contract BookShare is ERC721, Ownable {
    using Strings for uint;
    uint256 private tokenIds;

    struct BookShareData {
        address authorAddr;
        uint256 totalShares;
        uint256 sharesAvailable;
        uint256 pricePerShare;
        uint256 rightsPercentage;
        uint256 marketFeePercentage;
        uint256 distributionFeePercentage;
        string baseURI; // Link ipfs://CID/
    }

    BookShareData public bookShareData;
    address public platformAddr;

    event BookShareSold(address indexed buyer, uint256 amount);
    event RoyaltiesDistributed();

    /**
     * @dev Constructor to initialize the Book Share.
     * @param _name The name of the BookShare contract.
     * @param _symbol The symbol of the BookShare contract.
     * @param _authorAddr The address of the author who created the Book Share.
     * @param _rightsPercentage The percentage of rights ceded by the author.
     * @param _totalShares The total number of Book Shares.
     * @param _pricePerShare The price of each Book Share in Wei.
     * @param _baseURI The base URI for token metadata.
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _authorAddr,
        uint256 _rightsPercentage,
        uint256 _totalShares,
        uint256 _pricePerShare,
        string memory _baseURI,
        address _platformAddr
    ) Ownable(_platformAddr) ERC721(_name, _symbol) {
        bookShareData = BookShareData({
            authorAddr: _authorAddr,
            rightsPercentage: _rightsPercentage,
            totalShares: _totalShares,
            pricePerShare: _pricePerShare,
            baseURI: _baseURI,
            sharesAvailable: _totalShares, // Number of Book Shares still available
            marketFeePercentage: 500, // Platform fee percentage for primary and secondary market
            distributionFeePercentage: 300 // Platform fee percentage for royalty distribution
        });
        platformAddr = _platformAddr;
    }

    /**
     * @dev Function to get the BookShare URI.
     * @return A string representing the BookShare URI.
     */
    function bookshareURI() public view returns (string memory) {
        return bookShareData.baseURI;
    }

    /**
     *
     * @param _quantity The quantity of Bookshares to buy
     * @return totalCost The total cost of the Book Shares, including market fees.
     * @return marketFee The market fee associated with the purchase.
     */
    function getTotalCost(
        uint256 _quantity
    ) public view returns (uint256 totalCost, uint256 marketFee) {
        marketFee =
            (_quantity *
                bookShareData.pricePerShare *
                bookShareData.marketFeePercentage) /
            10000;
        totalCost = (_quantity * bookShareData.pricePerShare) + marketFee;
    }

    /**
     * @dev Function to buy Book Shares.
     * @param _quantity The quantity of Book Shares to buy.
     */
    function buyShares(uint256 _quantity) external payable {
        require(_quantity > 0, "Quantity must be greater than 0");
        require(
            bookShareData.sharesAvailable >= _quantity,
            "Not enough Book Shares available"
        );

        // Calculate total cost and market fee
        (uint256 totalCost, uint256 marketFee) = getTotalCost(_quantity);
        require(msg.value >= totalCost, "Insufficient funds");

        // Transfer market fees to platform address
        (bool successFee, ) = platformAddr.call{value: marketFee}("");
        require(successFee, "Failed to transfer fee");

        // Transfer funds to the author
        uint256 remainingCost = totalCost - marketFee;
        (bool successBuy, ) = bookShareData.authorAddr.call{
            value: remainingCost
        }("");
        require(successBuy, "Failed to transfer funds to author");

        // Mint new Book Shares to the buyer
        for (uint256 i = 1; i <= _quantity; i++) {
            --bookShareData.sharesAvailable;
            _safeMint(msg.sender, tokenIds);
            ++tokenIds;
        }

        // Emit an event for the Book Shares being sold
        emit BookShareSold(msg.sender, totalCost);
    }

    /**
     * @dev Function to distribute royalties to all holders.
     * @param _revenue The total revenue for calculating royalties.
     */
    function distributeRoyalties(uint256 _revenue) external onlyOwner {
        require(_revenue > 0, "Revenue must be greater than 0");

        // Calculate royalties based on the author's percentage ceded
        uint256 royalties = _revenue * bookShareData.rightsPercentage;

        // Calculate distribution fee
        uint256 distributionFee = (royalties *
            bookShareData.distributionFeePercentage) / 10000;

        // Transfer distribution fee to platform address (replace with your platform's address)
        (bool successFee, ) = platformAddr.call{value: distributionFee}("");
        require(successFee, "Failed to transfer fee");

        // Calculate remaining royalties
        uint256 remainingRoyalties = royalties - distributionFee;

        // Distribute remaining royalties proportionally to all holders
        for (uint256 i = 0; i < bookShareData.totalShares; i++) {
            address holder = ownerOf(i);

            // Calculate holder's share of royalties
            uint256 holderShare = (balanceOf(holder) * remainingRoyalties) /
                (bookShareData.totalShares - bookShareData.sharesAvailable);

            // Transfer royalties to the holder
            (bool successRoyalties, ) = holder.call{value: holderShare}("");
            require(successRoyalties, "Failed to transfer royalties");
        }

        // Emit an event for royalties distribution
        emit RoyaltiesDistributed();
    }
}
