import contractAddress from "../abi/contract-address.json";
import DonaTheta from "../abi/DonaTheta.json";
import {decodeError} from "ethers-decode-error";

import {ethers} from "ethers";
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

    /* ================================================
    * ============= Public Variables ==================
    * ================================================= */

    static async queryIsDonaStaff(contract) {
        try {
            const isDonaStaff = await contract.isUserDonaStaff();
            return isDonaStaff;
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
            const projectName = await contract.getDonationProjectTextDetails(projectId, 0);
            const projectDescription = await contract.getDonationProjectTextDetails(projectId, 1);

            const donationTarget = this.formatEther(await contract.getDonationProjectNumericalDetails(projectId, 1), 16);

            const totalAmountDonated = this.formatEther(await contract.getDonationProjectNumericalDetails(projectId, 2));
            const totalAmountWithdrawn = this.formatEther(await contract.getDonationProjectNumericalDetails(projectId, 3));

            const numberOfDonors = parseInt(await contract.getDonationProjectNumericalDetails(projectId, 4));
            const startDonationDate = parseInt(await contract.getDonationProjectNumericalDetails(projectId, 5));
            const endDonationDate = parseInt(await contract.getDonationProjectNumericalDetails(projectId, 6));
            const numberOfWithdrawalRequests = parseInt(await contract.getDonationProjectNumericalDetails(projectId, 7));

            return {
                projectId: projectId,
                projectName: projectName,
                projectDescription: projectDescription,
                donationTarget: donationTarget,
                totalAmountDonated: totalAmountDonated,
                totalAmountWithdrawn: totalAmountWithdrawn,
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

    static async getDonationProjectAmountWithdrawn(contract, projectId) {
        try {
            const amount = await contract.getDonationProjectNumericalDetails(projectId, 2);
            return amount;
        } catch (error) {
            throw new Error("Failed to get project withdrawn funds");
        }
    }

    static async getAmountDonatedToProject(contract, projectId) {
        try {
            return await contract.getDonationProjectNumericalDetails(projectId, 7);
        } catch (error) {
            throw new Error("Failed to get project donated funds");
        }
    }

    static async getNumberOfWithdrawalRequestsInProject(contract, projectId) {
        try {
            return await contract.getDonationProjectNumericalDetails(projectId, 6);
        } catch (error) {
            throw new Error("Failed to get project donated funds");
        }
    }


    // Withdraw Request

    static async queryWithdrawRequest(contract, projectId, requestId) {
        try {
            const requestName = await contract.getWithdrawalRequestTextDetails(projectId, requestId, 0);
            const requestDescription = await contract.getWithdrawalRequestTextDetails(projectId, requestId, 1);

            const withdrawalAmount = await contract.getWithdrawalRequestNumericalDetails(projectId, requestId, 0);
            const numberOfApprovals = await contract.getWithdrawalRequestNumericalDetails(projectId, requestId, 1);
            const numberOfRejections = await contract.getWithdrawalRequestNumericalDetails(projectId, requestId, 2);

            return {
                requestName: requestName,
                requestDescription: requestDescription,
                withdrawalAmount: withdrawalAmount,
                numberOfApprovals: numberOfApprovals,
                numberOfRejections: numberOfRejections
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

            console.log(`createDonationProject: 
                            startDonationDate: ${startDonationDate}
                            endDonationDate: ${endDonationDate}
            `);

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
            console.error("Failed to create donation project", error);
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
            const tx = await contract.makeDonation(projectId, {value: amount});
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
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

    static async fullyApproveWithdrawalRequest(contract, projectId, requestId) {
        try {
            const tx = await contract.fullyApproveWithdrawalRequest(projectId, requestId);
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
            throw new Error("Failed to fully approve withdrawal request");
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

    // =======================
    // ==== Donation Item ====
    // =======================

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

    static async addDonationProjectAudioClipItem(
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
                4 // Audio Clip
            );
        } catch (e) {
            console.error("Failed to add audio clip item:", e);
        }
    }

    //</editor-fold>
    //<editor-fold desc="Get Items">
    // Get Items

    static async getDonationProjectImageItems(contract, projectId) {
        try {
            return await contract.getDonationProjectMediaItems(
                projectId,
                0 // Image
            );
        } catch (e) {
            console.error("Failed to get image items:", e);
        }
    }

    static async getDonationProjectDocumentItems(contract, projectId) {
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

    static async getDonationProjectVideoItems(contract, projectId) {
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

    static async getDonationProjectLiveStreamItems(contract, projectId) {
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

    static async getDonationProjectAudioClipItems(contract, projectId) {
        try {
            const items = await contract.getDonationProjectMediaItems(
                projectId,
                4 // Audio Clip
            );
            return items;
        } catch (e) {
            console.error("Failed to get audio clip items:", e);
        }
    }

    //</editor-fold>
    //<editor-fold desc="Edit Items">
    // Edit Items

    static async editDonationProjectImageItem(
        contract,
        projectId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editDonationProjectMediaItem(
                projectId,
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
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editDonationProjectMediaItem(
                projectId,
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
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editDonationProjectMediaItem(
                projectId,
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
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editDonationProjectMediaItem(
                projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                3 // LiveStream
            );
        } catch (e) {
            console.error("Failed to edit live stream item:", e);
        }
    }

    static async editDonationProjectAudioClipItem(
        contract,
        projectId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) {
        try {
            const tx = await contract.editDonationProjectMediaItem(
                projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl,
                4 // Audio Clip
            );
        } catch (e) {
            console.error("Failed to edit audio clip item:", e);
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

    static async deleteDonationProjectAudioClipItem(contract, projectId, mediaItemIndex) {
        try {
            const tx = await contract.deleteDonationProjectMediaItem(
                projectId,
                mediaItemIndex,
                4 // Audio Clip
            );
        } catch (e) {
            console.error("Failed to delete audio clip item:", e);
        }
    }

    //</editor-fold>
    //</editor-fold>
    //<editor-fold desc="Withdrawal Request Media Functions">

    // ============================
    // ==== Withdrawal Request ====
    // ============================


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

    static async addWithdrawalRequestAudioClipItem(
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
                4 // Audio Clip
            );
        } catch (e) {
            console.error("Failed to add audio clip item:", e);
        }
    }

    //</editor-fold>
    //<editor-fold desc="Get Items">

    // Get Items

    static async getWithdrawalRequestImageItems(
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

    static async getWithdrawalRequestDocumentItems(
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

    static async getWithdrawalRequestVideoItems(
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

    static async getWithdrawalRequestLiveStreamItems(
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

    static async getWithdrawalRequestAudioClipItems(
        contract,
        projectId,
        requestId
    ) {
        try {
            const items = await contract.getWithdrawalRequestMediaItems(
                projectId,
                requestId,
                4 // Audio Clip
            );
            return items;
        } catch (e) {
            console.error("Failed to get audio clip items:", e);
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

    static async editWithdrawalRequestAudioClipItem(
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
                4 // Audio Clip
            );
        } catch (e) {
            console.error("Failed to edit audio clip item:", e);
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

    static async deleteWithdrawalRequestAudioClipItem(
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
                4 // Audio Clip
            );
        } catch (e) {
            console.error("Failed to delete audio clip item:", e);
        }
    }

    //</editor-fold>
    //</editor-fold>
    //</editor-fold>
    //</editor-fold>

}
