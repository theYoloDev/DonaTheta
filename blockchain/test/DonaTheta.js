// This file contains tests for DonaTheta

const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('DonaTheta', function () {
    let deployer, user1, user2, user3;
    let donaTheta;

    beforeEach(async () => {
        // Set up accounts
        [deployer, user1, user2, user3] = await ethers.getSigners();

        // Deploy Contract
        const DonaTheta = await ethers.getContractFactory("DonaTheta");
        donaTheta = await DonaTheta.deploy();
        await donaTheta.deployed();
    });

    describe("DonaTheta Contract", function () {
        it("sets the owner", async () => {
            const result = await donaTheta.owner();
            expect(result).to.equal(deployer.address);
        });

        it("allows owner or staff to create a donation project", async () => {
            await donaTheta.createDonationProject(
                0,  // DonationPeriodType.STRICT
                [user1.address],
                tokens(100),
                Math.floor(Date.now() / 1000),  // start time
                Math.floor(Date.now() / 1000) + 3600  // end time
            );

            const project = await donaTheta.donationProjects(0);
            expect(project.donationTarget).to.equal(tokens(100));
        });

        it("allows owner or staff to approve a donation project", async () => {
            await donaTheta.createDonationProject(
                0,  // DonationPeriodType.STRICT
                [user1.address],
                tokens(100),
                Math.floor(Date.now() / 1000),  // start time
                Math.floor(Date.now() / 1000) + 3600  // end time
            );

            await donaTheta.approveDonationProject(0);
            const project = await donaTheta.donationProjects(0);
            expect(project.isApproved).to.be.true;
        });

        it("allows donations to approved projects", async () => {
            await donaTheta.createDonationProject(
                0,  // DonationPeriodType.STRICT
                [user1.address],
                tokens(100),
                Math.floor(Date.now() / 1000),  // start time
                Math.floor(Date.now() / 1000) + 3600  // end time
            );

            await donaTheta.approveDonationProject(0);
            await donaTheta.connect(user2).makeDonation(0, { value: tokens(10) });

            const project = await donaTheta.donationProjects(0);
            expect(project.totalAmountDonated).to.equal(tokens(10));
        });

        it("allows organizers to create a withdrawal request", async () => {
            await donaTheta.createDonationProject(
                0,  // DonationPeriodType.STRICT
                [user1.address],
                tokens(100),
                Math.floor(Date.now() / 1000),  // start time
                Math.floor(Date.now() / 1000) + 3600  // end time
            );

            await donaTheta.approveDonationProject(0);
            await donaTheta.connect(user2).makeDonation(0, { value: tokens(10) });

            await donaTheta.connect(user1).createWithdrawalRequest(0, tokens(5));
            const request = await donaTheta.withdrawalRequests(0, 0);
            expect(request.withdrawAmount).to.equal(tokens(5));
        });

        it("allows committee members to approve a withdrawal request", async () => {
            await donaTheta.createDonationProject(
                0,  // DonationPeriodType.STRICT
                [user1.address],
                tokens(100),
                Math.floor(Date.now() / 1000),  // start time
                Math.floor(Date.now() / 1000) + 3600  // end time
            );

            await donaTheta.approveDonationProject(0);
            await donaTheta.connect(user2).makeDonation(0, { value: tokens(10) });

            await donaTheta.connect(user1).createWithdrawalRequest(0, tokens(5));
            await donaTheta.connect(user1).approveWithdrawalRequest(0, 0);
            const request = await donaTheta.withdrawalRequests(0, 0);
            expect(request.numberOfApprovals).to.equal(1);
        });

        it("allows fully approved withdrawal request to be executed", async () => {
            await donaTheta.createDonationProject(
                0,  // DonationPeriodType.STRICT
                [user1.address],
                tokens(100),
                Math.floor(Date.now() / 1000),  // start time
                Math.floor(Date.now() / 1000) + 3600  // end time
            );

            await donaTheta.approveDonationProject(0);
            await donaTheta.connect(user2).makeDonation(0, { value: tokens(10) });

            await donaTheta.connect(user1).createWithdrawalRequest(0, tokens(5));
            await donaTheta.connect(user1).approveWithdrawalRequest(0, 0);
            await donaTheta.connect(deployer).fullyApproveWithdrawalRequest(0, 0);
            await donaTheta.connect(user1).withdrawFunds(0, 0);

            const request = await donaTheta.withdrawalRequests(0, 0);
            expect(request.withdrawalRequestStatus).to.equal(4);  // Withdrawn
        });
    });
});
