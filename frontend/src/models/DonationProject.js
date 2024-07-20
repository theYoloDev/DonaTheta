// Object to represent a single donation project
export default class DonationProject {
    constructor(
        donationPeriodType,
        organizers = [],
        donationTarget,
        startDonationDate,
        endDonationDate,
        isApproved = false,
        isOpenForDonations = false,
        donors = [],
        totalAmountDonated = 0,
        totalAmountWithdrawn = 0,
        totalDonationsByAddress = {},
        topContributors = [],
        randomContributors = [],
        totalDonaApprovalCommitteeMembers = 0
    ) {
        this.donationPeriodType = donationPeriodType;              // The strictness of donation periods
        this.organizers = organizers;                              // The Organizers of the Donation Project
        this.donationTarget = donationTarget;                      // The donation target of the project
        this.startDonationDate = startDonationDate;                // Start DateTime of the donations (Epoch Seconds)
        this.endDonationDate = endDonationDate;                    // End DateTime of the donations (Epoch Seconds)
        this.isApproved = isApproved;                              // Whether or not the project is approved by DonaTheta Organizers
        this.isOpenForDonations = isOpenForDonations;              // The project is open for donations
        this.donors = donors;                                      // Number of donors
        this.totalAmountDonated = totalAmountDonated;              // Total amount donated
        this.totalAmountWithdrawn = totalAmountWithdrawn;          // Total amount withdrawn
        this.totalDonationsByAddress = totalDonationsByAddress;    // Total amount of donations per address
        this.topContributors = topContributors;                    // Top Contributors who are members of the committee
        this.randomContributors = randomContributors;              // Random Contributors who are members of the committee
        this.totalDonaApprovalCommitteeMembers = totalDonaApprovalCommitteeMembers;  // The total number of committee members
    }
}
