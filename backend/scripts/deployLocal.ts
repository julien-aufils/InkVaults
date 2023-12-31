import "dotenv/config";
import { ethers } from "hardhat";

async function createBookShare(
  factory: any,
  name: string,
  symbol: string,
  author: any,
  totalShares: number,
  pricePerShare: string,
  baseURI: string
) {
  await factory.createBookShare(
    name,
    symbol,
    author.address,
    totalShares,
    pricePerShare,
    baseURI
  );
}

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const bookshareFactory = await ethers.deployContract("BookShareFactory");
  await bookshareFactory.waitForDeployment();

  const bookShareData = [
    {
      name: "The Three-Body Problem",
      symbol: "TBP",
      author: addr1,
      totalShares: 150,
      pricePerShare: "1500000000000000",
      baseURI:
        "ipfs://bafybeieykkopgeymc2qrh6dc2dcqzfiojwomo55unwc2jzhzp6aq4rs3l4",
    },
    {
      name: "The Dark Forest",
      symbol: "TDF",
      author: addr1,
      totalShares: 200,
      pricePerShare: "2000000000000000",
      baseURI:
        "ipfs://bafybeigcjqcvnv7muytgqunxaukqvu2skjkkc3a3gofv2evxbipurbcj7e",
    },
    {
      name: "Death's End",
      symbol: "DED",
      author: addr1,
      totalShares: 100,
      pricePerShare: "1000000000000000",
      baseURI:
        "ipfs://bafybeiaej3c34f7ce6q2btdhb2vg65ykyyihgfnyp32nf4w7wuv3betwam",
    },
    {
      name: "Alice au pays des cryptos",
      symbol: "APC",
      author: addr2,
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
      data.author,
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
