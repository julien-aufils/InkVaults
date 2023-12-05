import "dotenv/config";
import { ethers } from "hardhat";

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const bookshareFactory = await ethers.deployContract("BookShareFactory");

  await bookshareFactory.waitForDeployment();

  await bookshareFactory.createBookShare(
    "The Three-Body Problem",
    "TBP",
    addr1.address,
    1500,
    150,
    "1500000000000000",
    "ipfs://bafybeieykkopgeymc2qrh6dc2dcqzfiojwomo55unwc2jzhzp6aq4rs3l4"
  );

  await bookshareFactory.createBookShare(
    "The Dark Forest",
    "TDF",
    addr1.address,
    2000,
    200,
    "2000000000000000",
    "ipfs://bafybeigcjqcvnv7muytgqunxaukqvu2skjkkc3a3gofv2evxbipurbcj7e"
  );

  await bookshareFactory.createBookShare(
    "Death's End",
    "DED",
    addr1.address,
    1000,
    100,
    "1000000000000000",
    "ipfs://bafybeiaej3c34f7ce6q2btdhb2vg65ykyyihgfnyp32nf4w7wuv3betwam"
  );

  await bookshareFactory.createBookShare(
    "Alice au pays des cryptos",
    "APC",
    addr2.address,
    2500,
    50,
    "5000000000000000",
    "ipfs://bafybeiglcsfnsvrpaeei2lmvrxylf7zygjf2ihlfr47y2awhwlx4umhvda"
  );

  const booksharesAddr1 = await bookshareFactory.getBookSharesByAuthor(
    addr1.address
  );
  const booksharesAddr2 = await bookshareFactory.getBookSharesByAuthor(
    addr2.address
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
