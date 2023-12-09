import "dotenv/config";
import { ethers } from "hardhat";

async function createBookShare(
  factory: any,
  name: string,
  symbol: string,
  authorAddress: string,
  totalShares: number,
  pricePerShare: string,
  baseURI: string
) {
  await factory.createBookShare(
    name,
    symbol,
    authorAddress,
    totalShares,
    pricePerShare,
    baseURI
  );
}

async function main() {
  const bookshareFactory = await ethers.deployContract("BookShareFactory");
  await bookshareFactory.waitForDeployment();

  const bookShareData = [
    {
      name: "The Three-Body Problem",
      symbol: "TBP",
      authorAddress: "0xb0e9769001a3B7eA2440b492426484FD10B16183",
      totalShares: 150,
      pricePerShare: "1500000000000000",
      baseURI:
        "ipfs://bafybeieykkopgeymc2qrh6dc2dcqzfiojwomo55unwc2jzhzp6aq4rs3l4",
    },
    {
      name: "The Dark Forest",
      symbol: "TDF",
      authorAddress: "0xb0e9769001a3B7eA2440b492426484FD10B16183",
      totalShares: 200,
      pricePerShare: "2000000000000000",
      baseURI:
        "ipfs://bafybeigcjqcvnv7muytgqunxaukqvu2skjkkc3a3gofv2evxbipurbcj7e",
    },
    {
      name: "Death's End",
      symbol: "DED",
      authorAddress: "0xb0e9769001a3B7eA2440b492426484FD10B16183",
      totalShares: 100,
      pricePerShare: "1000000000000000",
      baseURI:
        "ipfs://bafybeiaej3c34f7ce6q2btdhb2vg65ykyyihgfnyp32nf4w7wuv3betwam",
    },
    {
      name: "Alice au pays des cryptos",
      symbol: "APC",
      authorAddress: "0xfFA13a19DFdAaD83ecD0c089C0A05752984cD026",
      totalShares: 50,
      pricePerShare: "5000000000000000",
      baseURI:
        "ipfs://bafybeiglcsfnsvrpaeei2lmvrxylf7zygjf2ihlfr47y2awhwlx4umhvda",
    },
  ];

  for (const data of bookShareData) {
    await createBookShare(
      bookshareFactory,
      data.name,
      data.symbol,
      data.authorAddress,
      data.totalShares,
      data.pricePerShare,
      data.baseURI
    );
  }

  console.log(`BookShareFactory deployed to ${bookshareFactory.target}`);
}

// Use the same error handling pattern
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
