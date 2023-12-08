// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BookShare
 * @dev ERC-721 token representing a Book Share.
 * @author Julien Aufils
 */
contract BookShare is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint;
    uint256 private tokenIds;

    struct BookShareData {
        address authorAddr;
        uint256 totalShares;
        uint256 sharesAvailable;
        uint256 pricePerShare;
        uint256 marketFeePercentage;
        uint256 distributionFeePercentage;
        uint256 totalRoyalties;
        string baseURI; // Link ipfs://CID/
    }

    BookShareData public bookShareData;
    address public platformAddr;

    mapping(address => uint256) public withdrawnRoyalties;

    event BookShareSold(
        address indexed buyer,
        uint256 quantity,
        uint256 amount
    );
    event RoyaltiesDistributed(uint256 totalRoyalties);
    event RoyaltiesWithdrawn(address indexed holder, uint256 amount);

    /**
     * @dev Constructor to initialize the Book Share.
     * @param _name The name of the BookShare contract.
     * @param _symbol The symbol of the BookShare contract.
     * @param _authorAddr The address of the author who created the Book Share.
     * @param _totalShares The total number of Book Shares.
     * @param _pricePerShare The price of each Book Share in Wei.
     * @param _baseURI The base URI for token metadata.
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _authorAddr,
        uint256 _totalShares,
        uint256 _pricePerShare,
        string memory _baseURI,
        address _platformAddr
    ) Ownable(_platformAddr) ERC721(_name, _symbol) {
        bookShareData = BookShareData({
            authorAddr: _authorAddr,
            totalShares: _totalShares,
            pricePerShare: _pricePerShare,
            baseURI: _baseURI,
            sharesAvailable: _totalShares, // Number of Book Shares still available
            marketFeePercentage: 500, // Platform fee percentage for primary and secondary market
            distributionFeePercentage: 300, // Platform fee percentage for royalty distribution
            totalRoyalties: 0
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
    function buyShares(uint256 _quantity) external payable nonReentrant {
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
        emit BookShareSold(msg.sender, _quantity, totalCost);
    }

    /**
     * @dev Function to distribute royalties to all holders.
     */
    function distributeRoyalties() external payable onlyOwner {
        require(msg.value > 0, "Revenue must be greater than 0");

        // Calculate distribution fee
        uint256 distributionFee = (msg.value *
            bookShareData.distributionFeePercentage) / 10000;

        // Transfer distribution fee to platform address (replace with your platform's address)
        (bool successFee, ) = platformAddr.call{value: distributionFee}("");
        require(successFee, "Failed to transfer fee");

        // Calculate remaining royalties
        uint256 remainingRoyalties = msg.value - distributionFee;

        // Reset totalRoyalties to zero before distribution
        bookShareData.totalRoyalties = 0;

        // Update total royalties
        bookShareData.totalRoyalties += remainingRoyalties;

        // Emit an event for royalties distribution
        emit RoyaltiesDistributed(bookShareData.totalRoyalties);
    }

    /**
     * @dev Function for holders to withdraw their royalties.
     */
    function withdrawRoyalties() external nonReentrant {
        require(balanceOf(msg.sender) >= 1, "You don't own any shares");
        require(withdrawnRoyalties[msg.sender] == 0, "Already withdrawn");

        // Calculate holder's share of royalties
        uint256 holderShare = (bookShareData.totalRoyalties *
            balanceOf(msg.sender)) / bookShareData.totalShares;

        // Update withdrawnRoyalties to prevent multiple withdrawals
        withdrawnRoyalties[msg.sender] = holderShare;

        // Transfer royalties to the holder
        (bool successRoyalties, ) = msg.sender.call{value: holderShare}("");
        require(successRoyalties, "Failed to transfer royalties");

        // Emit an event for royalties withdrawal
        emit RoyaltiesWithdrawn(msg.sender, holderShare);
    }
}
