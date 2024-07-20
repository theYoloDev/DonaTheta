


export default class DonaThetaBlockchainApi {

    static async initializeContract(provider) {
        return new ethers.Contract(
            provider,
            DonaThetaBlockchainApi,
            provider.getSigner(0)
        );
    }

    static async createDonationProject(
        contract,
        donationPeriodType,
        organizers,
        donationTarget,
        startDonationDate,
        endDonationDate
    ) {
        try {
            const tx = await contract.createDonationProject(
                donationPeriodType,
                organizers,
                donationTarget,
                startDonationDate,
                endDonationDate
            );
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
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
            const tx = await contract.makeDonation(projectId, { value: amount });
            await tx.wait(); // Wait for transaction to be mined
            return tx;
        } catch (error) {
            throw new Error("Failed to make donation");
        }
    }

    static async createWithdrawalRequest(
        contract,
        projectId,
        amount
    ) {
        try {
            const tx = await contract.createWithdrawalRequest(projectId, amount);
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

    static async getProjectWithdrawnFunds(contract, projectId) {
        try {
            const amount = await contract.getProjectWithdrawnFunds(projectId);
            return amount;
        } catch (error) {
            throw new Error("Failed to get project withdrawn funds");
        }
    }

    static async getProjectDonatedFunds(contract, projectId) {
        try {
            const amount = await contract.getProjectDonatedFunds(projectId);
            return amount;
        } catch (error) {
            throw new Error("Failed to get project donated funds");
        }
    }

}
