import "dotenv/config";
import { ethers } from "hardhat";

async function main() {
  const bookshareFactory = await ethers.deployContract("BookShareFactory");

  await bookshareFactory.waitForDeployment();

  await bookshareFactory.createBookShare(
    "The Three-Body Problem",
    "TBP",
    "0xb0e9769001a3B7eA2440b492426484FD10B16183",
    1500,
    150,
    15,
    "ipfs://bafybeibs6tekw5gx7oppl4qf2nip6vkzs52ycis5ta6jlt3qckglekhvhu"
  );

  await bookshareFactory.createBookShare(
    "The Dark Forest",
    "TDF",
    "0xb0e9769001a3B7eA2440b492426484FD10B16183",
    2000,
    200,
    20,
    "ipfs://bafybeici4nshctl6ewtnvqmfxcqpaempzympujrcfsdvkp2z6e6zj4jmja"
  );

  await bookshareFactory.createBookShare(
    "Death's End",
    "DED",
    "0xb0e9769001a3B7eA2440b492426484FD10B16183",
    1000,
    100,
    10,
    "ipfs://bafybeihmpdmj46fvmkc3qb7xyhkikd7vzyx3elrp7p7pu4uhorasggyeym"
  );

  await bookshareFactory.createBookShare(
    "Alice au pays des cryptos",
    "APC",
    "0xfFA13a19DFdAaD83ecD0c089C0A05752984cD026",
    2500,
    50,
    50,
    "ipfs://bafybeia5r3357hq2ejhuocbmsz4cydrlddi5u7i6hdzollcr3glmfne5cm"
  );

  const booksharesAddr1 = await bookshareFactory.getBookSharesByAuthor(
    "0xb0e9769001a3B7eA2440b492426484FD10B16183"
  );
  const booksharesAddr2 = await bookshareFactory.getBookSharesByAuthor(
    "0xfFA13a19DFdAaD83ecD0c089C0A05752984cD026"
  );

  console.log(`BookShareFactory deployed to ${bookshareFactory.target}`);
  console.log(`Bookshares author 1 : ${booksharesAddr1}`);
  console.log(`Bookshares author 2 : ${booksharesAddr2}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
