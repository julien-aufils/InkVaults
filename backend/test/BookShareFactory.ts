import { ethers } from "hardhat";
import { expect } from "chai";

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Tests BookShare factory", function () {
  async function deployContractFixture() {
    const [owner, author1, author2, buyer1, buyer2] = await ethers.getSigners();
    const contract = await ethers.getContractFactory("BookShareFactory");
    const bookshareFactory = await contract.deploy();

    return { bookshareFactory, owner, author1, author2, buyer1, buyer2 };
  }

  async function deployContractWithBookshares() {
    const [owner, author1, author2, buyer1, buyer2] = await ethers.getSigners();
    const contract = await ethers.getContractFactory("BookShareFactory");
    const bookshareFactory = await contract.deploy();

    const bookshareNames = [
      "The Three-Body Problem",
      "The Dark Forest",
      "Death's End",
      "Alice au pays des cryptos",
    ];
    const bookshareSymbols = ["TBP", "TDF", "DED", "APC"];
    const authors = [
      author1.address,
      author1.address,
      author1.address,
      author2.address,
    ];
    const totalShares = [150, 200, 100, 50];
    const pricePerShare = [
      "1500000000000000",
      "2000000000000000",
      "1000000000000000",
      "5000000000000000",
    ];
    const baseURIs = [
      "ipfs://bafybeieykkopgeymc2qrh6dc2dcqzfiojwomo55unwc2jzhzp6aq4rs3l4",
      "ipfs://bafybeigcjqcvnv7muytgqunxaukqvu2skjkkc3a3gofv2evxbipurbcj7e",
      "ipfs://bafybeiaej3c34f7ce6q2btdhb2vg65ykyyihgfnyp32nf4w7wuv3betwam",
      "ipfs://bafybeiglcsfnsvrpaeei2lmvrxylf7zygjf2ihlfr47y2awhwlx4umhvda",
    ];

    const deployedBookshares = [];

    for (let i = 0; i < bookshareNames.length; i++) {
      await bookshareFactory.createBookShare(
        bookshareNames[i],
        bookshareSymbols[i],
        authors[i],
        totalShares[i],
        pricePerShare[i],
        baseURIs[i]
      );

      const booksharesAddr = await bookshareFactory.getAllBookShares();
      const bookshare = await ethers.getContractAt(
        "BookShare",
        booksharesAddr[i],
        owner
      );
      deployedBookshares.push(bookshare);
    }

    return {
      bookshareFactory,
      deployedBookshares,
      owner,
      author1,
      author2,
      buyer1,
      buyer2,
    };
  }

  async function deployContractWithRoyaltiesDistributed() {
    const {
      bookshareFactory,
      deployedBookshares,
      owner,
      author1,
      author2,
      buyer1,
      buyer2,
    } = await loadFixture(deployContractWithBookshares);

    const quantityToBuy = 3;
    const { totalCost, marketFee } = await deployedBookshares[0].getTotalCost(
      quantityToBuy
    );
    await deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
      value: totalCost,
    });
    await deployedBookshares[0].connect(buyer2).buyShares(quantityToBuy, {
      value: totalCost,
    });

    const revenue = 25000;
    await deployedBookshares[0].distributeRoyalties({ value: revenue });

    return {
      bookshareFactory,
      deployedBookshares,
      owner,
      author1,
      author2,
      buyer1,
      buyer2,
    };
  }

  describe("Deployment", function () {
    it("Should deploy BookShare Factory", async function () {
      const { bookshareFactory, owner } = await loadFixture(
        deployContractFixture
      );
      expect(await bookshareFactory.owner()).to.equal(owner.address);
    });

    it("Should deploy Bookshares", async function () {
      const { bookshareFactory, owner } = await loadFixture(
        deployContractWithBookshares
      );
      const booksharesAddr = await bookshareFactory.getAllBookShares();
      for (let i = 0; i < booksharesAddr.length; i++) {
        const bookshare = await ethers.getContractAt(
          "BookShare",
          booksharesAddr[i],
          owner
        );
        expect(await bookshare.owner()).to.equal(
          await bookshareFactory.owner()
        );
      }
    });
  });

  describe("BookShare Factory", function () {
    it("Should revert if not the owner", async function () {
      const { bookshareFactory, author2 } = await loadFixture(
        deployContractFixture
      );

      await expect(
        bookshareFactory
          .connect(author2)
          .createBookShare(
            "Alice au pays des cryptos",
            "APC",
            author2.address,
            50,
            "5000000000000000",
            "ipfs://bafybeiglcsfnsvrpaeei2lmvrxylf7zygjf2ihlfr47y2awhwlx4umhvda"
          )
      ).to.be.revertedWithCustomError(
        bookshareFactory,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should return bookshares by author", async function () {
      const { bookshareFactory, deployedBookshares, author1, author2 } =
        await loadFixture(deployContractWithBookshares);

      const booksharesByAuthor1 = await bookshareFactory.getBookSharesByAuthor(
        author1.address
      );

      const expectedBooksharesAuthor1 = deployedBookshares
        .slice(0, 3)
        .map((bookshare: any) => bookshare.target);

      const booksharesAuthor1Formatted = booksharesByAuthor1.map(
        (bookshare: any) => bookshare
      );

      expect(booksharesAuthor1Formatted).to.have.same.members(
        expectedBooksharesAuthor1
      );

      const booksharesByAuthor2 = await bookshareFactory.getBookSharesByAuthor(
        author2.address
      );

      const booksharesAuthor2Formatted = booksharesByAuthor2.map(
        (bookshare: any) => bookshare
      );

      expect(booksharesAuthor2Formatted).to.have.same.members([
        deployedBookshares[3].target,
      ]);
    });
  });

  describe("BookShares Contract", function () {
    describe("Buy Shares", function () {
      it("Should revert if quantity is equal to 0", async function () {
        const { deployedBookshares } = await loadFixture(
          deployContractWithBookshares
        );
        await expect(deployedBookshares[0].buyShares(0)).to.be.revertedWith(
          "Quantity must be greater than 0"
        );
      });

      it("Should revert if quantity is superior to shares available", async function () {
        const { deployedBookshares } = await loadFixture(
          deployContractWithBookshares
        );
        await expect(deployedBookshares[0].buyShares(151)).to.be.revertedWith(
          "Not enough Book Shares available"
        );
      });

      it("Should revert if not enough funds is sent", async function () {
        const { deployedBookshares } = await loadFixture(
          deployContractWithBookshares
        );
        await expect(
          deployedBookshares[0].buyShares(2, { value: 1500000000000000 })
        ).to.be.revertedWith("Insufficient funds");
      });

      it("Should transfer fees to the platform", async function () {
        const { deployedBookshares, owner, buyer1 } = await loadFixture(
          deployContractWithBookshares
        );

        const platformBalanceBefore = await ethers.provider.getBalance(
          owner.address
        );

        const quantityToBuy = 3;
        const { totalCost, marketFee } =
          await deployedBookshares[0].getTotalCost(quantityToBuy);
        await deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
          value: totalCost,
        });

        const platformBalanceAfter = await ethers.provider.getBalance(
          owner.address
        );

        expect(platformBalanceAfter).to.equal(
          platformBalanceBefore + marketFee
        );
      });

      it("Should transfer funds to the author", async function () {
        const { deployedBookshares, buyer1, author1 } = await loadFixture(
          deployContractWithBookshares
        );

        const authorBalanceBefore = await ethers.provider.getBalance(
          author1.address
        );

        const quantityToBuy = 3;
        const { totalCost, marketFee } =
          await deployedBookshares[0].getTotalCost(quantityToBuy);
        await deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
          value: totalCost,
        });

        const authorBalanceAfter = await ethers.provider.getBalance(
          author1.address
        );

        const remainingCost = BigInt(totalCost - marketFee);
        expect(authorBalanceAfter).to.equal(
          authorBalanceBefore + remainingCost
        );
      });

      it("Should change shares available quantity", async function () {
        const { deployedBookshares, owner, buyer1, author1 } =
          await loadFixture(deployContractWithBookshares);

        const bookShareDataBefore = await deployedBookshares[0].bookShareData();
        const sharesAvailableBefore = Number(bookShareDataBefore[2]);

        const quantityToBuy = 3;
        const { totalCost, marketFee } =
          await deployedBookshares[0].getTotalCost(quantityToBuy);
        await deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
          value: totalCost,
        });

        const bookShareDataAfter = await deployedBookshares[0].bookShareData();
        const sharesAvailableAfter = Number(bookShareDataAfter[2]);

        const expectedBookShareAfter = sharesAvailableBefore - quantityToBuy;

        await expect(sharesAvailableAfter).to.be.equal(expectedBookShareAfter);
      });

      it("Should mint tokens to buyer", async function () {
        const { deployedBookshares, owner, buyer1, author1 } =
          await loadFixture(deployContractWithBookshares);

        const buyerBalanceBefore = Number(
          await deployedBookshares[0].balanceOf(buyer1.address)
        );

        const quantityToBuy = 3;
        const { totalCost, marketFee } =
          await deployedBookshares[0].getTotalCost(quantityToBuy);
        await deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
          value: totalCost,
        });

        const buyerBalanceAfter = Number(
          await deployedBookshares[0].balanceOf(buyer1.address)
        );

        expect(buyerBalanceAfter).to.be.equal(
          buyerBalanceBefore + quantityToBuy
        );
      });

      it("Should emit the BookShare Sold event", async function () {
        const { deployedBookshares, owner, buyer1, author1 } =
          await loadFixture(deployContractWithBookshares);

        const quantityToBuy = 3;
        const { totalCost, marketFee } =
          await deployedBookshares[0].getTotalCost(quantityToBuy);
        await deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
          value: totalCost,
        });

        await expect(
          deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
            value: totalCost,
          })
        )
          .to.emit(deployedBookshares[0], "BookShareSold")
          .withArgs(buyer1.address, quantityToBuy, totalCost);
      });
    });

    describe("Distribute Royalties", function () {
      it("Should revert if not the owner", async function () {
        const { deployedBookshares, author1 } = await loadFixture(
          deployContractWithBookshares
        );

        await expect(
          deployedBookshares[0]
            .connect(author1)
            .distributeRoyalties({ value: 25000 })
        ).to.be.revertedWithCustomError(
          deployedBookshares[0],
          "OwnableUnauthorizedAccount"
        );
      });

      it("Should revert if revenue is equal to 0", async function () {
        const { deployedBookshares } = await loadFixture(
          deployContractWithBookshares
        );
        await expect(
          deployedBookshares[0].distributeRoyalties({ value: 0 })
        ).to.be.revertedWith("Revenue must be greater than 0");
      });

      it("Should distribute fee to platform address", async function () {
        const { deployedBookshares, buyer1, owner } = await loadFixture(
          deployContractWithBookshares
        );

        const quantityToBuy = 3;
        const { totalCost, marketFee } =
          await deployedBookshares[0].getTotalCost(quantityToBuy);
        await deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
          value: totalCost,
        });

        const platformBalanceBefore = Number(
          await ethers.provider.getBalance(owner.address)
        );

        const revenue = 25000;
        await deployedBookshares[0].distributeRoyalties({ value: revenue });

        const platformBalanceAfter = Number(
          await ethers.provider.getBalance(owner.address)
        );

        const bookShareData = await deployedBookshares[0].bookShareData();
        const distributionFee = Number(bookShareData[5]);

        const expectedFee = (revenue * distributionFee) / 10000;

        const expectedBalanceAfter = platformBalanceBefore + expectedFee;
        expect(platformBalanceAfter).to.equal(expectedBalanceAfter);
      });

      it("Should update the total royalties", async function () {
        const { deployedBookshares, buyer1, owner } = await loadFixture(
          deployContractWithBookshares
        );

        const quantityToBuy = 3;
        const { totalCost, marketFee } =
          await deployedBookshares[0].getTotalCost(quantityToBuy);
        await deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
          value: totalCost,
        });

        const bookShareDataBefore = await deployedBookshares[0].bookShareData();
        const distributionFee = Number(bookShareDataBefore[5]);
        const totalRoyaltiesBefore = Number(bookShareDataBefore[6]);

        const revenue = 25000;
        await deployedBookshares[0].distributeRoyalties({ value: revenue });

        const expectedFee = (revenue * distributionFee) / 10000;
        const expectedRoyalties = totalRoyaltiesBefore + revenue - expectedFee;

        const bookShareDataAfter = await deployedBookshares[0].bookShareData();
        const totalRoyaltiesAfter = Number(bookShareDataAfter[6]);

        expect(totalRoyaltiesAfter).to.equal(expectedRoyalties);
      });

      it("Should emit the event RoyaltiesDistributed", async function () {
        const { deployedBookshares, buyer1, owner } = await loadFixture(
          deployContractWithBookshares
        );

        const quantityToBuy = 3;
        const { totalCost, marketFee } =
          await deployedBookshares[0].getTotalCost(quantityToBuy);
        await deployedBookshares[0].connect(buyer1).buyShares(quantityToBuy, {
          value: totalCost,
        });

        const bookShareData = await deployedBookshares[0].bookShareData();
        const distributionFee = Number(bookShareData[5]);

        const revenue = 25000;
        const expectedFee = (revenue * distributionFee) / 10000;
        const totalRoyalties = revenue - expectedFee;

        await expect(
          deployedBookshares[0].distributeRoyalties({ value: revenue })
        )
          .to.emit(deployedBookshares[0], "RoyaltiesDistributed")
          .withArgs(totalRoyalties);
      });
    });

    describe("Withdraw royalties", function () {
      it("Should revert if no royalty has been distributed", async function () {
        const { deployedBookshares } = await loadFixture(
          deployContractWithBookshares
        );
        await expect(
          deployedBookshares[0].withdrawRoyalties()
        ).to.be.revertedWith("No royalties distributed");
      });

      it("Should revert if user doesn't own any bookshare", async function () {
        const { deployedBookshares, author1 } = await loadFixture(
          deployContractWithRoyaltiesDistributed
        );

        await expect(
          deployedBookshares[0].connect(author1).withdrawRoyalties()
        ).to.be.revertedWith("You don't own any shares");
      });

      it("Should revert if user already withdrawn royalties", async function () {
        const { deployedBookshares, buyer1 } = await loadFixture(
          deployContractWithRoyaltiesDistributed
        );

        await deployedBookshares[0].connect(buyer1).withdrawRoyalties();

        await expect(
          deployedBookshares[0].connect(buyer1).withdrawRoyalties()
        ).to.be.revertedWith("Already withdrawn");
      });

      it("Should update withdrawnRoyalties and user balance", async function () {
        const { deployedBookshares, buyer1 } = await loadFixture(
          deployContractWithRoyaltiesDistributed
        );

        const withdrawnRoyaltiesBefore =
          await deployedBookshares[0].withdrawnRoyalties(buyer1.address);

        expect(withdrawnRoyaltiesBefore).to.equal(0);

        const userBalanceBefore = Number(
          await ethers.provider.getBalance(buyer1.address)
        );

        await deployedBookshares[0].connect(buyer1).withdrawRoyalties();

        const withdrawnRoyaltiesAfter =
          await deployedBookshares[0].withdrawnRoyalties(buyer1.address);

        const bookShareData = await deployedBookshares[0].bookShareData();
        const totalShares = bookShareData[1];
        const totalRoyalties = bookShareData[6];
        const nbOfShares = await deployedBookshares[0].balanceOf(
          buyer1.address
        );

        const expectedRoyalties = Number(
          (totalRoyalties * nbOfShares) / totalShares
        );

        expect(withdrawnRoyaltiesAfter).to.equal(expectedRoyalties);

        const userBalanceAfter = Number(
          await ethers.provider.getBalance(buyer1.address)
        );

        expect(userBalanceAfter).to.equal(
          expectedRoyalties + userBalanceBefore
        );
      });

      it("Should emit the event RoyaltiesWithdrawn", async function () {
        const { deployedBookshares, buyer1 } = await loadFixture(
          deployContractWithRoyaltiesDistributed
        );

        const bookShareData = await deployedBookshares[0].bookShareData();
        const totalShares = bookShareData[1];
        const totalRoyalties = bookShareData[6];
        const nbOfShares = await deployedBookshares[0].balanceOf(
          buyer1.address
        );

        const expectedRoyalties = Number(
          (totalRoyalties * nbOfShares) / totalShares
        );

        await expect(deployedBookshares[0].connect(buyer1).withdrawRoyalties())
          .to.emit(deployedBookshares[0], "RoyaltiesWithdrawn")
          .withArgs(buyer1.address, expectedRoyalties);
      });
    });

    describe("Bookshare URI", function () {
      it("Should return the bookshare URI", async function () {
        const { deployedBookshares } = await loadFixture(
          deployContractWithBookshares
        );

        const bookShareData = await deployedBookshares[0].bookShareData();
        const expectedBookshareURI = bookShareData[7];

        const bookshareURI = await deployedBookshares[0].bookshareURI();

        await expect(bookshareURI).to.equal(expectedBookshareURI);
      });
    });
  });
});
