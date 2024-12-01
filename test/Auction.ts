import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Auction", function () {
    async function deployOneDayAuctionFixture() {
        const ONE_DAY_IN_SECS = 24 * 60 * 60;

        const auctionTime = (await time.latest()) + ONE_DAY_IN_SECS;

        const [owner, otherAccount] = await hre.ethers.getSigners();

        const Auction = await hre.ethers.getContractFactory("Auction");
        const auction = await Auction.deploy(100);

        return { auction, auctionTime, owner, otherAccount };
    }

    describe("Pre-Start", function () {
        it("Should not allow a bid until the auction has started", async function () {
            const { auction } = await loadFixture(deployOneDayAuctionFixture);

            await expect(auction.bid({ value: 101 })).to.be.revertedWith(
                "not started"
            );
        });
    });

    describe("Post-Start", function () {
        it("Should not allow the auction to end early", async function () {
            const { auction } = await loadFixture(deployOneDayAuctionFixture);

            await auction.start();

            await expect(auction.end()).to.be.revertedWith(
                "end time in future"
            );
        });

        it("Should have an opening bid of 100 wei", async function () {
            const { auction } = await loadFixture(deployOneDayAuctionFixture);

            expect(await auction.highestBid()).to.equal(100);
        });

        it("Should not accept a bid lower than or equal to the current bid", async function () {
            const { auction, otherAccount } = await loadFixture(
                deployOneDayAuctionFixture
            );

            await auction.start();

            await expect(
                auction.first_bid(otherAccount.address, 1, {
                    value: 100,
                })
            ).to.be.revertedWith("value < highest");
        });

        it("Should not accept a bid if the user has not provided an NFT address", async function () {
            const { auction } = await loadFixture(deployOneDayAuctionFixture);

            await auction.start();

            await expect(
                auction.bid({
                    value: 101,
                })
            ).to.be.revertedWith("include nft to display");
        });

        it("Should not accept a bid if the user has provided an empty NFT address", async function () {
            const { auction } = await loadFixture(deployOneDayAuctionFixture);

            await auction.start();

            await expect(
                auction.first_bid(
                    "0x0000000000000000000000000000000000000000",
                    1,
                    {
                        value: 100,
                    }
                )
            ).to.be.revertedWith("value < highest");
        });
    });

    describe("Happy Path", function () {
        it("Should accept a bid higher than the current bid with an NFT address", async function () {
            const { auction, otherAccount } = await loadFixture(
                deployOneDayAuctionFixture
            );

            await auction.start();

            await auction.first_bid(otherAccount.address, 1, {
                value: 101,
            });

            expect(await auction.highestBid()).to.equal(101);
        });

        it("Should allow the auction to end after 1 day", async function () {
            const { auction, auctionTime } = await loadFixture(
                deployOneDayAuctionFixture
            );

            await auction.start();

            await time.increase(auctionTime);

            expect(await auction.end()).to.emit(auction, "End");
        });
    });
});
