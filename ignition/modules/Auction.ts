import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AuctionModule = buildModule("AuctionModule", (m) => {
    const auction = m.contract("Auction", [100]);

    return { auction };
});

export default AuctionModule;
