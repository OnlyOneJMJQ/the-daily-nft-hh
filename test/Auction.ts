import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Auction", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneDayAuctionFixture() {
        const ONE_DAY_IN_SECS = 24 * 60 * 60;

        const auctionTime = (await time.latest()) + ONE_DAY_IN_SECS;

        // Contracts are deployed using the first signer/account by default
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

        // it("Should not accept a bid lower than or equal to the current bid", async function () {
        //     const { auction, otherAccount } = await loadFixture(
        //         deployOneDayAuctionFixture
        //     );

        //     await auction.start();

        //     await expect(
        //         auction["bid(address,uint256)"]([otherAccount, 1], {
        //             value: 101,
        //         })
        //     ).to.be.revertedWith("value < highest");
        // });
    });
});
