import contractAddress from "../abi/contract-address.json";
import DonaTheta from "../abi/DonaTheta.json";
import {decodeError} from "ethers-decode-error";

import {ethers} from "ethers";
import WithdrawalRequestStatus from "../models/WithdrawalRequestStatus";
// const { ethers } =  require("ethers");

export default class DonaThetaArtifactEtherApi {

    static async getProvider() {
        return new ethers.providers.Web3Provider(window.ethereum);
    }

    static async initializeContract() {

        let provider = await this.getProvider();

        return new ethers.Contract(
            contractAddress.DonaTheta,
            DonaTheta.abi,
            provider.getSigner(0)
        );
    }

    static parseEther(value) {
        return ethers.utils.parseEther(value);
    }

    static formatEther(value) {
        return ethers.utils.formatEther(value);
    }

    static parseIntArray(values) {
        let ints = [];

        for (const value of values) {
            ints.push(parseInt(value));
        }

        return ints;
    }

    static parseStringArray(values) {
        let ints = [];

        for (const value of values) {
            ints.push(String(value));
        }

        return ints;
    }

    /* ================================================
    * ============= Public Variables ==================
    * ================================================= */

    static async queryIsDonaStaff(contract) {
        try {
            return await contract.isUserDonaStaff();
        } catch (e) {
            console.error("Error querying isDonaStaff:", e);
            throw e;

        }
    }

    static async getNumberOfDonationProjects(contract) {
        try {
            const numberOfDonationProjects = await contract.numberOfDonationProjects();
            return numberOfDonationProjects.toNumber(); // Convert BigNumber to number
        } catch (error) {
            console.error("Error getting number of donation projects:", error);
            throw error;
        }
    }

    static async getNumberOfWithdrawalRequests(contract) {
        try {
            const numberOfWithdrawalRequests = await contract.numberOfWithdrawalRequests();
            return numberOfWithdrawalRequests.toNumber(); // Convert BigNumber to number
        } catch (error) {
            console.error("Error getting number of withdrawal requests:", error);
            throw error;
        }
    }

    static async getTotalDonationsReceived(contract) {
        try {
            const totalDonationsReceived = await contract.totalDonationsReceived();
            return ethers.utils.formatEther(totalDonationsReceived); // Convert wei to ether
        } catch (error) {
            console.error("Error getting total donations received:", error);
            throw error;
        }
    }

    static async getTotalDonationsUtilized(contract) {
        try {
            const totalDonationsUtilized = await contract.totalDonationsUtilized();
            return ethers.utils.formatEther(totalDonationsUtilized); // Convert wei to ether
        } catch (error) {
            console.error("Error getting total donations received:", error);
            throw error;
        }
    }

    static async getTotalTargetAmount(contract) {
        try {
            const totalTargetAmount = await contract.totalTargetAmount();
            return ethers.utils.formatEther(totalTargetAmount); // Convert wei to ether
        } catch (error) {
            console.error("Error getting total target amount: ", error);
            throw error;
        }
    }

    // Project

    static async getUnapprovedDonationProjectIds(contract) {
        try {
            const unapprovedProjectIds = await contract.getUnapprovedDonationProjects();
            return unapprovedProjectIds;
        } catch (error) {
            console.error("Error getting total target amount: ", error);
            throw error;
        }
    }

    static async queryDonationProject(contract, projectId) {
        try {
            const projectName = String(await contract.getDonationProjectTextDetails(projectId, 0));
            const projectDescription = String(await contract.getDonationProjectTextDetails(projectId, 1));

            const donationTarget = this.formatEther(await contract.getDonationProjectNumericalDetails(projectId, 3), 16);

            const totalAmountDonated = this.formatEther(await contract.getDonationProjectNumericalDetails(projectId, 4));
            const totalAmountWithdrawn = this.formatEther(await contract.getDonationProjectNumericalDetails(projectId, 5));

            const numberOfDonors = parseInt(await contract.getDonationProjectNumericalDetails(projectId, 6));
            const startDonationDate = parseInt(await contract.getDonationProjectNumericalDetails(projectId, 7));
            const endDonationDate = parseInt(await contract.getDonationProjectNumericalDetails(projectId, 8));
            const numberOfWithdrawalRequests = parseInt(await contract.getDonationProjectNumericalDetails(projectId, 9));

            let isApproved = false
            if (parseInt(await contract.getDonationProjectNumericalDetails(projectId, 1)) === 1) {
                isApproved = true
            }

            let isFinalized = await this.checkIfDonationProjectIsFinalized(contract, projectId);

            return {
                projectId: projectId,
                projectName: projectName,
                projectDescription: projectDescription,
                donationTarget: donationTarget,
                totalAmountDonated: totalAmountDonated,
                totalAmountWithdrawn: totalAmountWithdrawn,
                isApproved: isApproved,
                isFinalized: isFinalized,
                numberOfDonors: numberOfDonors,
                startDonationDate: startDonationDate,
                endDonationDate: endDonationDate,
                numberOfWithdrawalRequests: numberOfWithdrawalRequests
            };
        } catch (error) {
            console.error("Error querying donation project:", error);
            throw error;
        }
    }

    static async checkIfDonationProjectIsFinalized(contract, projectId) {
        try {
            let isFinalized = false
            if (parseInt(await contract.getDonationProjectNumericalDetails(projectId, 2)) === 1) {
                isFinalized = true
            }
            return isFinalized;
        } catch (e) {
            console.error("DonaThetaEthersApi: checkIfDonationProjectIsFinalized: error checking if DonationProject is finalized")
        }
    }

    static async getDonationProjectOrganizers(contract, projectId) {
        try {
            return await contract.getDonationProjectOrganizers(projectId);
        } catch (e) {
            console.error("Error getting Donation project organizers:", e);
            throw e;
        }
    }

    static async getDonationProjectAmountWithdrawn(contract, projectId) {
        try {
            const amount = this.parseEther(await contract.getDonationProjectNumericalDetails(projectId, 5));
            return amount;
        } catch (error) {
            throw new Error("Failed to get project withdrawn funds");
        }
    }

    static async checkIfUserIsOrganizer(
        contract,
        projectId
    ) {
        try {
            const organizingProjects = await this.queryOrganizingProjects(contract);

            for (const organizingProjectsId in organizingProjects) {
                if (projectId === organizingProjectsId) {
                    return true;
                }
            }

            return false;
        } catch (e) {
            console.log("Error checking if User is Organizer:", e);
            throw e;
        }
    }

    static async checkIfUserIsCommitteeMember(
        contract,
        projectId
    ) {
        try {
            const committeeProjects = await this.queryCommitteeProjects(contract);

            for (const committeeProjectId in committeeProjects) {
                if (projectId === committeeProjectId) {
                    return true;
                }
            }

            return false;
        } catch (e) {
            console.log("Error checking if User is Committee member:", e);
            throw e;
        }
    }

    static async getAmountDonatedToProject(contract, projectId) {
        try {
            return this.formatEther(await contract.getDonationProjectNumericalDetails(projectId, 10));
        } catch (error) {
            throw new Error("Failed to get project donated funds");
        }
    }

    static async getNumberOfWithdrawalRequestsInProject(contract, projectId) {
        try {
            return parseInt(await contract.getDonationProjectNumericalDetails(projectId, 6));
        } catch (error) {
            throw new Error("Failed to get project donated funds");
        }
    }


    // Withdraw Request

    static async queryWithdrawRequest(contract, projectId, requestId) {
        try {
            const requestName = String(await contract.getWithdrawalRequestTextDetails(projectId, requestId, 0));
            const requestDescription = String(await contract.getWithdrawalRequestTextDetails(projectId, requestId, 1));

            const owner = String(await contract.getWithdrawalRequestOwner(projectId, requestId));

            const withdrawalRequestStatus = WithdrawalRequestStatus.getStatus(parseInt(await contract.getWithdrawalRequestNumericalDetails(projectId, requestId, 1)));

            const withdrawalAmount = this.formatEther(await contract.getWithdrawalRequestNumericalDetails(projectId, requestId, 0));
            const numberOfApprovals = parseInt(await contract.getWithdrawalRequestNumericalDetails(projectId, requestId, 2));
            const numberOfRejections = parseInt(await contract.getWithdrawalRequestNumericalDetails(projectId, requestId, 3));

            const approvals = this.parseStringArray(await contract.getWithdrawalRequestAddressesDetails(projectId, requestId, 0));
            const rejections = this.parseStringArray(await contract.getWithdrawalRequestAddressesDetails(projectId, requestId, 1));

            return {
                projectId: projectId,
                requestId: requestId,
                requestName: requestName,
                requestDescription: requestDescription,
                withdrawalRequestStatus: withdrawalRequestStatus,
                owner: owner,
                withdrawalAmount: withdrawalAmount,
                numberOfApprovals: numberOfApprovals,
                numberOfRejections: numberOfRejections,
                approvals: approvals,
                rejections: rejections
            };
        } catch (error) {
            console.error("Error querying withdrawal request:", error);
            throw error;
        }
    }

    //<editor-fold desc="Address">

    static async queryOrganizingProjects(contract) {
        try {
            const organizingProjects = await contract.getUserProjects(0);
            return organizingProjects;
        } catch (error) {
            console.error("Error querying organizing projects:", error);
            throw error;
        }
    }

    static async queryCommitteeProjects(contract) {
        try {
            const commiteeProjects = await contract.getUserProjects(1);
            return commiteeProjects;
        } catch (error) {
            console.error("Error querying committee projects:", error);
            throw error;
        }
    }


    //</editor-fold>
    //<editor-fold desc="Functions">

    //<editor-fold desc="Admin">
    static async getDonaStaffMembers(contract) {
        try {
            const staff = await contract.getDonaStaffMembers();
            return staff;
        } catch (e) {
            console.log("Error when getting DonaStaff: " + e);
            throw e;
        }
    }

    static async addDonaStaffMember(contract, address) {
        try {
            const tx = await contract.addDonaStaffMember(address);
            return tx.wait();
        } catch (e) {
            console.error("Error querying committee projects:", e);
            throw e;
        }
    }

    //</editor-fold>


    //<editor-fold desc="Donation Project Functions">

    static async createDonationProject(
        contract,
        name,
        description,
        donationPeriodType,
        organizers,
        donationTarget,
        startDonationDate,
        endDonationDate
    ) {
        try {

            const tx = await contract.createDonationProject(
                donationPeriodType,
                name,
                description,
                organizers,
                donationTarget,
                startDonationDate,
                endDonationDate,
                {
                    gasLimit: 420000
                }
            );
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
            const {decodedError} = decodeError(error);
            console.error("Failed to create donation project", decodedError);
            throw new Error("Failed to create donation project");
        }
    }

    static async approveDonationProject(
        contract,
        projectId
    ) {
        try {
            const tx = await contract.approveDonationProject(projectId);
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
            throw new Error("Failed to approve donation project");
        }
    }

    static async makeDonation(contract, projectId, amount) {
        try {
            const tx = await contract.makeDonation(
                projectId,
                {
                    value: amount
                });
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
            console.log("DonaThetaEthersApi: error when making donation");
            console.log(decodeError(error));
            throw new Error("Failed to make donation");
        }
    }

    //</editor-fold>
    //<editor-fold desc="Withdrawal Request">

    static async createWithdrawalRequest(
        contract,
        projectId,
        requestName,
        requestDescription,
        amount
    ) {
        try {
            const tx = await contract.createWithdrawalRequest(
                projectId,
                requestName,
                requestDescription,
                amount
            );
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
            throw new Error("Failed to create withdrawal request");
        }
    }

    static async approveWithdrawalRequest(contract, projectId, requestId) {
        try {
            const tx = await contract.approveWithdrawalRequest(projectId, requestId);
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
            throw new Error("Failed to approve withdrawal request");
        }
    }

    static async rejectWithdrawalRequest(contract, projectId, requestId) {
        try {
            const tx = await contract.rejectWithdrawalRequest(projectId, requestId);
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
            throw new Error("Failed to reject withdrawal request");
        }
    }

    static async withdrawFunds(contract, projectId, requestId) {
        try {
            const tx = await contract.withdrawFunds(projectId, requestId);
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
            throw new Error("Failed to withdraw funds");
        }
    }

    //</editor-fold>

    //<editor-fold desc="Media Item Functions">

    //<editor-fold desc="Donation Item Media Functions">

    //<editor-fold desc="Add Items">
    // Add Items

    static async addDonationProjectImageItem(
        contract,
        projectId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.addDonationProjectMediaItem(
                projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                0 // Image
            );
        } catch (e) {
            console.error("Failed to add image item:", e);
        }
    }

    static async addDonationProjectDocumentItem(
        contract,
        projectId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.addDonationProjectMediaItem(
                projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                1 // Document
            );

            return tx;
        } catch (e) {
            console.error("Failed to add document item:", e);
        }
    }

    static async addDonationProjectVideoItem(
        contract,
        projectId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.addDonationProjectMediaItem(
                projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                2 // Video
            );
        } catch (e) {
            console.error("Failed to add video item:", e);
        }
    }

    static async addDonationProjectLiveStreamItem(
        contract,
        projectId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.addDonationProjectMediaItem(
                projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                3 // LiveStream
            );
        } catch (e) {
            console.error("Failed to add live stream item:", e);
        }
    }


    //</editor-fold>
    //<editor-fold desc="Get Items">
    // Get Items

    static async queryDonationProjectImageItems(contract, projectId) {
        try {
            return await contract.getDonationProjectMediaItems(
                projectId,
                0 // Image
            );
        } catch (e) {
            console.error("Failed to get image items:", e);
        }
    }

    static async queryDonationProjectDocumentItems(contract, projectId) {
        try {
            const items = await contract.getDonationProjectMediaItems(
                projectId,
                1 // Document
            );
            return items;
        } catch (e) {
            console.error("Failed to get document items:", e);
        }
    }

    static async queryDonationProjectVideoItems(contract, projectId) {
        try {
            const items = await contract.getDonationProjectMediaItems(
                projectId,
                2 // Video
            );
            return items;
        } catch (e) {
            console.error("Failed to get video items:", e);
        }
    }

    static async queryDonationProjectLiveStreamItems(contract, projectId) {
        try {
            const items = await contract.getDonationProjectMediaItems(
                projectId,
                3 // LiveStream
            );
            return items;
        } catch (e) {
            console.error("Failed to get live stream items:", e);
        }
    }

    //</editor-fold>
    //<editor-fold desc="Edit Items">
    // Edit Items

    static async editDonationProjectImageItem(
        contract,
        projectId,
        mediaItemIndex,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editDonationProjectMediaItem(
                projectId,
                mediaItemIndex,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                0 // Image
            );
        } catch (e) {
            console.error("Failed to edit image item:", e);
        }
    }

    static async editDonationProjectDocumentItem(
        contract,
        projectId,
        mediaItemIndex,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editDonationProjectMediaItem(
                projectId,
                mediaItemIndex,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                1 // Document
            );
        } catch (e) {
            console.error("Failed to edit document item:", e);
        }
    }

    static async editDonationProjectVideoItem(
        contract,
        projectId,
        mediaItemIndex,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editDonationProjectMediaItem(
                projectId,
                mediaItemIndex,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                2 // Video
            );
        } catch (e) {
            console.error("Failed to edit video item:", e);
        }
    }

    static async editDonationProjectLiveStreamItem(
        contract,
        projectId,
        mediaItemIndex,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editDonationProjectMediaItem(
                projectId,
                mediaItemIndex,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                3 // LiveStream
            );
        } catch (e) {
            console.error("Failed to edit live stream item:", e);
        }
    }

    //</editor-fold>
    //<editor-fold desc="Delete Items">
    // Delete Items

    static async deleteDonationProjectImageItem(contract, projectId, mediaItemIndex) {
        try {
            const tx = await contract.deleteDonationProjectMediaItem(
                projectId,
                mediaItemIndex,
                0 // Image
            );
        } catch (e) {
            console.error("Failed to delete image item:", e);
        }
    }

    static async deleteDonationProjectDocumentItem(contract, projectId, mediaItemIndex) {
        try {
            const tx = await contract.deleteDonationProjectMediaItem(
                projectId,
                mediaItemIndex,
                1 // Document
            );
        } catch (e) {
            console.error("Failed to delete document item:", e);
        }
    }

    static async deleteDonationProjectVideoItem(contract, projectId, mediaItemIndex) {
        try {
            const tx = await contract.deleteDonationProjectMediaItem(
                projectId,
                mediaItemIndex,
                2 // Video
            );
        } catch (e) {
            console.error("Failed to delete video item:", e);
        }
    }

    static async deleteDonationProjectLiveStreamItem(contract, projectId, mediaItemIndex) {
        try {
            const tx = await contract.deleteDonationProjectMediaItem(
                projectId,
                mediaItemIndex,
                3 // LiveStream
            );
        } catch (e) {
            console.error("Failed to delete live stream item:", e);
        }
    }

    //</editor-fold>
    //</editor-fold>
    //<editor-fold desc="Withdrawal Request Media Functions">


    //<editor-fold desc="Add Items">
    // Add Items

    static async addWithdrawalRequestImageItem(
        contract,
        projectId,
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.addWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                0 // Image
            );
            tx.wait();
            return tx;
        } catch (e) {
            console.error("Failed to add image item:", e);
        }
    }

    static async addWithdrawalRequestDocumentItem(
        contract,
        projectId,
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.addWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                1 // Document
            );
        } catch (e) {
            console.error("Failed to add document item:", e);
        }
    }

    static async addWithdrawalRequestVideoItem(
        contract,
        projectId,
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.addWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                2 // Video
            );
        } catch (e) {
            console.error("Failed to add video item:", e);
        }
    }

    static async addWithdrawalRequestLiveStreamItem(
        contract,
        projectId,
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.addWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                3 // LiveStream
            );
        } catch (e) {
            console.error("Failed to add live stream item:", e);
        }
    }

    //</editor-fold>
    //<editor-fold desc="Get Items">

    // Get Items

    static async queryWithdrawalRequestImageItems(
        contract,
        projectId,
        requestId
    ) {
        try {
            const items = await contract.getWithdrawalRequestMediaItems(
                projectId,
                requestId,
                0 // Image
            );
            return items;
        } catch (e) {
            console.error("Failed to get image items:", e);
        }
    }

    static async queryWithdrawalRequestDocumentItems(
        contract,
        projectId,
        requestId
    ) {
        try {
            const items = await contract.getWithdrawalRequestMediaItems(
                projectId,
                requestId,
                1 // Document
            );
            return items;
        } catch (e) {
            console.error("Failed to get document items:", e);
        }
    }

    static async queryWithdrawalRequestVideoItems(
        contract,
        projectId,
        requestId
    ) {
        try {
            const items = await contract.getWithdrawalRequestMediaItems(
                projectId,
                requestId,
                2 // Video
            );
            return items;
        } catch (e) {
            console.error("Failed to get video items:", e);
        }
    }

    static async queryWithdrawalRequestLiveStreamItems(
        contract,
        projectId,
        requestId
    ) {
        try {
            const items = await contract.getWithdrawalRequestMediaItems(
                projectId,
                requestId,
                3 // LiveStream
            );
            return items;
        } catch (e) {
            console.error("Failed to get live stream items:", e);
        }
    }

    //</editor-fold>
    //<editor-fold desc="Edit Items">

    // Edit Items

    static async editWithdrawalRequestImageItem(
        contract,
        projectId,
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                0 // Image
            );
        } catch (e) {
            console.error("Failed to edit image item:", e);
        }
    }

    static async editWithdrawalRequestDocumentItem(
        contract,
        projectId,
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                1 // Document
            );
        } catch (e) {
            console.error("Failed to edit document item:", e);
        }
    }

    static async editWithdrawalRequestVideoItem(
        contract,
        projectId,
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                2 // Video
            );
        } catch (e) {
            console.error("Failed to edit video item:", e);
        }
    }

    static async editWithdrawalRequestLiveStreamItem(
        contract,
        projectId,
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                3 // LiveStream
            );
        } catch (e) {
            console.error("Failed to edit live stream item:", e);
        }
    }

    //</editor-fold>
    //<editor-fold desc="Delete Items">

    // Delete Items

    static async deleteWithdrawalRequestImageItem(
        contract,
        projectId,
        requestId,
        mediaItemIndex
    ) {
        try {
            const tx = await contract.deleteWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemIndex,
                0 // Image
            );
        } catch (e) {
            console.error("Failed to delete image item:", e);
        }
    }

    static async deleteWithdrawalRequestDocumentItem(
        contract,
        projectId,
        requestId,
        mediaItemIndex
    ) {
        try {
            const tx = await contract.deleteWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemIndex,
                1 // Document
            );
        } catch (e) {
            console.error("Failed to delete document item:", e);
        }
    }

    static async deleteWithdrawalRequestVideoItem(
        contract,
        projectId,
        requestId,
        mediaItemIndex
    ) {
        try {
            const tx = await contract.deleteWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemIndex,
                2 // Video
            );
        } catch (e) {
            console.error("Failed to delete video item:", e);
        }
    }

    static async deleteWithdrawalRequestLiveStreamItem(
        contract,
        projectId,
        requestId,
        mediaItemIndex
    ) {
        try {
            const tx = await contract.deleteWithdrawalRequestMediaItem(
                projectId,
                requestId,
                mediaItemIndex,
                3 // LiveStream
            );
        } catch (e) {
            console.error("Failed to delete live stream item:", e);
        }
    }


    //</editor-fold>
    //</editor-fold>
    //</editor-fold>
    //</editor-fold>

}
