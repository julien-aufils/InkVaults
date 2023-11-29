// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// Factory contract for creating BookShare contracts
contract BookShareFactory is Ownable {
    event BookShareCreated(address indexed bookShareContract, address indexed author, uint256 rightsPercentage, uint256 totalShares, uint256 pricePerShare);

    // Mapping to track Book Shares created by each author
    mapping(address => address[]) public booksharesByAuthor;
         
    constructor() Ownable(msg.sender){}

    // Function to create a new BookShare contract
    function createBookShare(
        string memory _name,
        string memory _symbol,
        uint256 _rightsPercentage,
        uint256 _totalShares,
        uint256 _pricePerShare,
        string memory _baseURI
    ) external onlyOwner {
        // Deploy the BookShare contract
        BookShare newBookShare = new BookShare(_name, _symbol, msg.sender, _rightsPercentage, _totalShares, _pricePerShare, _baseURI);

        // Track the Book Share created by the author
        booksharesByAuthor[msg.sender].push(address(newBookShare));

        // Emit an event for the new BookShare creation
        emit BookShareCreated(address(newBookShare), msg.sender, _rightsPercentage, _totalShares, _pricePerShare);
    }
}