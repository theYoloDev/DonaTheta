// Object to represent a single withdrawal request
export default class WithdrawalRequest {
    constructor(projectId, withdrawalRequestStatus, owner, withdrawAmount, numberOfApprovals, numberOfRejections, approvals = [], rejections = []) {
        this.projectId = projectId;                                // The projectId of the project
        this.withdrawalRequestStatus = withdrawalRequestStatus;    // Status of the withdrawal request
        this.owner = owner;                                        // Owner of the request
        this.withdrawAmount = withdrawAmount;                      // Amount to be withdrawn
        this.numberOfApprovals = numberOfApprovals;                // Number of approvals
        this.numberOfRejections = numberOfRejections;              // Number of rejections
        this.approvals = approvals;                                // List of addresses that approved
        this.rejections = rejections;                              // List of addresses that rejected
    }
}
