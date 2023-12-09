import "dotenv/config";
import { ethers } from "hardhat";

async function main() {
  const bookshareFactory = await ethers.deployContract("BookShareFactory");

  await bookshareFactory.waitForDeployment();

  await bookshareFactory.createBookShare(
    "The Three-Body Problem",
    "TBP",
    "0xb0e9769001a3B7eA2440b492426484FD10B16183",
    150,
    "1500000000000000",
    "ipfs://bafybeieykkopgeymc2qrh6dc2dcqzfiojwomo55unwc2jzhzp6aq4rs3l4"
  );

  await bookshareFactory.createBookShare(
    "The Dark Forest",
    "TDF",
    "0xb0e9769001a3B7eA2440b492426484FD10B16183",
    200,
    "2000000000000000",
    "ipfs://bafybeigcjqcvnv7muytgqunxaukqvu2skjkkc3a3gofv2evxbipurbcj7e"
  );

  await bookshareFactory.createBookShare(
    "Death's End",
    "DED",
    "0xb0e9769001a3B7eA2440b492426484FD10B16183",
    100,
    "1000000000000000",
    "ipfs://bafybeiaej3c34f7ce6q2btdhb2vg65ykyyihgfnyp32nf4w7wuv3betwam"
  );

  await bookshareFactory.createBookShare(
    "Alice au pays des cryptos",
    "APC",
    "0xfFA13a19DFdAaD83ecD0c089C0A05752984cD026",
    50,
    "5000000000000000",
    "ipfs://bafybeiglcsfnsvrpaeei2lmvrxylf7zygjf2ihlfr47y2awhwlx4umhvda"
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
