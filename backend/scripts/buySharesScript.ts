import { ethers } from "hardhat";

async function main() {
  const authorAddr = "0xb0e9769001a3B7eA2440b492426484FD10B16183";
  const platformAddr = "0x59992191401fb871B512d23546FB0Fe52e2DaB7a";

  // Deploy the BookShare contract
  const BookShare = await ethers.getContractFactory("BookShare");
  const bookShare = await BookShare.deploy(
    "BookShareName", // Name of the BookShare contract
    "BSN", // Symbol of the BookShare contract
    authorAddr, // Author's address
    100, // Total number of shares
    10000, // Price per share in Wei
    "ipfs://CID/", // Base URI for token metadata
    platformAddr // Platform address
  );
  await bookShare.waitForDeployment();
  console.log(`BookShare deployed to ${bookShare.target}`);

  // Get the total cost for buying the specified quantity of shares
  const quantityToBuy = 5;
  const { totalCost } = await bookShare.getTotalCost(quantityToBuy);
  console.log("Total Cost", Number(totalCost));

  // Buy the specified quantity of shares
  await bookShare.buyShares(quantityToBuy, {
    value: totalCost,
  });
  console.log("Shares bought with success !");
}

// Use the same error handling pattern
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
