// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import './BookShare.sol';

/**
 * @title BookShareFactory
 * @dev Factory contract for creating BookShare contracts.
 */
contract BookShareFactory is Ownable {
    event BookShareCreated(address indexed bookShareContract, address indexed author, uint256 rightsPercentage, uint256 totalShares, uint256 pricePerShare);

    // Array to track all BookShares created
    address[] booksharesCreated;

    // Mapping to track Book Shares created by each author
    mapping(address => address[]) booksharesByAuthor;
         
    constructor() Ownable(msg.sender){}

    /**
     * @dev Creates a new BookShare contract.
     * @param _name The name of the BookShare contract.
     * @param _symbol The symbol of the BookShare contract.
     * @param _rightsPercentage The percentage of rights ceded by the author.
     * @param _totalShares The total number of Book Shares.
     * @param _pricePerShare The price of each Book Share in Wei.
     * @param _baseURI The base URI for token metadata.
     */
    function createBookShare(
        string memory _name,
        string memory _symbol,
        address _author,
        uint256 _rightsPercentage,
        uint256 _totalShares,
        uint256 _pricePerShare,
        string memory _baseURI
    ) external onlyOwner {
        // Deploy the BookShare contract
        BookShare newBookShare = new BookShare(_name, _symbol, _author, _rightsPercentage, _totalShares, _pricePerShare, _baseURI);

        // Track the global list of all BookShares
        booksharesCreated.push(address(newBookShare));

        // Track the Book Share created by the author
        booksharesByAuthor[_author].push(address(newBookShare));

        // Emit an event for the new BookShare creation
        emit BookShareCreated(address(newBookShare), _author, _rightsPercentage, _totalShares, _pricePerShare);
    }

    /**
     * @dev Get all BookShares created.
     * @return addresses An array of all BookShare contract addresses.
     */
    function getAllBookShares() external view returns (address[] memory) {
        return booksharesCreated;
    }

    /**
     * @dev Get all BookShares associated with a specific author.
     * @param _author The address of the author.
     * @return addresses An array of BookShare contract addresses.
     */
    function getBookSharesByAuthor(address _author) external view returns (address[] memory addresses) {
        return booksharesByAuthor[_author];
    }



    
}