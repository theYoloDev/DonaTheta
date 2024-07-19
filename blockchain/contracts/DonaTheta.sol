// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "hardhat/console.sol";

// This is the piggy bank for a donation project
contract DonaTheta {
    // Dona organizers
    address public owner;
    address[] public donaStaff;

    uint256 public latestDonationProjectId = 0;
    uint256 public latestWithdrawRequestId = 0;

    // Mapping to store donation projects with a unique ID
    mapping(uint256 => DonationProject) public donationProjects;
    // Mapping from donation project to withdrawal request with a unique ID
    mapping(uint256 => mapping(uint256 => WithdrawalRequest)) public withdrawalRequests;

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Modifier to restrict access to only the owner or staff members
    modifier onlyOwnerOrStaff() {
        bool isOwnerOrStaff = msg.sender == owner;

        if (!isOwnerOrStaff) {
            for (uint i = 0; i < donaStaff.length;) {
                if (msg.sender == donaStaff[i]) {
                    isOwnerOrStaff = true;
                }
                unchecked {i++;}
            }
        }

        require(isOwnerOrStaff, "Only owner or staff can call this function");
        _;
    }

    // Modifier to ensure the project is approved
    modifier onlyApprovedProject(uint256 projectId) {
        require(donationProjects[projectId].isApproved, "The action can only happen on an approved project");
        _;
    }

    // Modifier to restrict access to only the organizers of the project
    modifier onlyOrganizer(uint256 projectId) {
        DonationProject storage currentDonationProject = donationProjects[projectId];

        bool isOrganizer = false;
        for (uint8 i = 0; i < currentDonationProject.organizers.length;) {
            if (msg.sender == currentDonationProject.organizers[i]) {
                isOrganizer = true;
                break;
            }
            unchecked {i++;}
        }

        require(isOrganizer, "The action can only be performed by organizers of the project");
        _;
    }

    // Modifier to restrict access to Dona Approval Committee members
    modifier onlyDonaApprovalCommitteeMember(uint256 projectId) {
        DonationProject storage currentDonationProject = donationProjects[projectId];

        bool isDonaApprovalCommitteeMember = false;

        for (uint8 i = 0; i < currentDonationProject.topContributors.length;) {
            if (msg.sender == currentDonationProject.topContributors[i]) {
                isDonaApprovalCommitteeMember = true;
                break;
            }
            unchecked {i++;}
        }

        if (!isDonaApprovalCommitteeMember) {
            for (uint8 i = 0; i < currentDonationProject.randomContributors.length;) {
                if (msg.sender == currentDonationProject.randomContributors[i]) {
                    isDonaApprovalCommitteeMember = true;
                    break;
                }
                unchecked {i++;}
            }
        }

        if (!isDonaApprovalCommitteeMember) {
            for (uint8 i = 0; i < currentDonationProject.organizers.length;) {
                if (msg.sender == currentDonationProject.organizers[i]) {
                    isDonaApprovalCommitteeMember = true;
                    break;
                }
                unchecked {i++;}
            }
        }

        require(isDonaApprovalCommitteeMember, "This action can only be performed by members of The Dona Approval Committee");
        _;
    }

    modifier projectExists(uint256 projectId) {
        // Check if the projectId is valid by verifying if the project is approved or if any properties are set
        require(donationProjects[projectId].donationTarget > 0, "Project does not exist");
        _;
    }

    // Modifier to check if Project is already approved
    modifier projectIsNotApproved(uint256 projectId) {
        DonationProject storage currentDonationProject = donationProjects[projectId];
        require(!currentDonationProject.isApproved, "Project is already Approved!");
        _;
    }

    // Modifier to ensure the project is safe for donations
    modifier projectSafeForDonation(uint256 projectId) {
        DonationProject storage currentDonationProject = donationProjects[projectId];
        require(currentDonationProject.isApproved, "Donation can only happen on an approved project");

        if (currentDonationProject.donationPeriodType == DonationPeriodType.STRICT) {
            uint currentTime = block.timestamp;
            require(currentTime > currentDonationProject.startDonationDate, "Donation cannot happen before selected period");
            require(currentTime < currentDonationProject.endDonationDate, "Donation cannot happen after selected period");
            require(currentDonationProject.isOpenForDonations, "The Donation Project has been closed");
        } else {
            require(currentDonationProject.isOpenForDonations, "The Donation Project has been closed to donations");
        }
        _;
    }

    modifier projectIsClosedForDonations(uint256 projectId) {
        DonationProject storage currentDonationProject = donationProjects[projectId];
        require(currentDonationProject.isOpenForDonations, "The Donation Project is not closed for donations");
        _;
    }

    // Modifier to check whether a Withdrawal Request is ready for Voting
    modifier requestSafeForVoting(
        uint256 projectId,
        uint256 requestId
    ) {
        WithdrawalRequest storage currentWithdrawalRequest = withdrawalRequests[projectId][requestId];
        require(currentWithdrawalRequest.withdrawalRequestStatus != WithdrawalRequestStatus.Withdrawn, "You cannot vote on an already withdrawn request");

        // Ensure the sender has not cast another vote
        bool hasVoted = false;
        for (uint i = 0; i < currentWithdrawalRequest.approvals.length; i++) {
            if (currentWithdrawalRequest.approvals[i] == msg.sender) {
                hasVoted = true;
                break;
            }
        }
        for (uint i = 0; i < currentWithdrawalRequest.rejections.length; i++) {
            if (currentWithdrawalRequest.rejections[i] == msg.sender) {
                hasVoted = true;
                break;
            }
        }
        require(!hasVoted, "You have already voted on this request");
        _;
    }



    // Enum to define donation period types
    enum DonationPeriodType {
        STRICT,  // Donations can only occur during the predetermined period
        OPEN     // Donations are open to occur at any point in time
    }

    // Enum to define the status of a withdrawal request
    enum WithdrawalRequestStatus {
        New,
        ApprovedByCommittee,
        FullyApproved,
        Rejected,
        Withdrawn
    }

    // Struct to represent a single withdrawal request
    struct WithdrawalRequest {
        uint256 projectId;                                // The projectId of the project
        WithdrawalRequestStatus withdrawalRequestStatus;  // Status of the withdrawal request
        address owner;                                    // Owner of the request
        uint256 withdrawAmount;                           // Amount to be withdrawn
        uint256 numberOfApprovals;                        // Number of approvals
        uint256 numberOfRejections;                       // Number of rejections
        address[] approvals;                              // List of addresses that approved
        address[] rejections;                             // List of addresses that rejected
    }

    // Struct to represent a single donation project
    struct DonationProject {
        DonationPeriodType donationPeriodType;                  // The strictness of donation periods
        address[] organizers;                                   // The Organizers of the Donation Project
        uint256 donationTarget;                                 // The donation target of the project
        uint256 startDonationDate;                              // Start DateTime of the donations (Epoch Seconds)
        uint256 endDonationDate;                                // End DateTime of the donations (Epoch Seconds)

        bool isApproved;                                        // Whether or not the project is approved by DonaTheta Organizers
        bool isOpenForDonations;                                // The project is open for donations

        address[] donors;                                       // Number of donors
        uint256 totalAmountDonated;                             // Total amount donated
        mapping(address => uint256) totalDonationsByAddress;    // Total amount of donations per address

        address[] topContributors;                              // Top Contributors who are members of the committee
        address[] randomContributors;                           // Random Contributors who are members of the committee
        uint8 totalDonaApprovalCommitteeMembers;                // The total number of committee members
    }

    // Events to log various actions
    event DonationProjectCreated(uint256 indexed projectId, address[] organizers, uint256 donationTarget);
    event DonationProjectApproved(uint256 indexed projectId);
    event DonationProjectFinalized(uint256 indexed projectId);
    event DonationMade(uint256 indexed projectId, address donor, uint256 amount);
    event WithdrawalRequestCreated(uint256 indexed projectId, uint256 requestId, uint256 amount);
    event WithdrawalRequestApproved(uint256 indexed projectId, uint256 requestId, address approver);
    event WithdrawalRequestRejected(uint256 indexed projectId, uint256 requestId, address rejecter);
    event WithdrawalRequestFinalized(uint256 indexed projectId, uint256 requestId, WithdrawalRequestStatus status);
    event WithdrawalExecuted(uint256 indexed projectId, uint256 requestId, uint256 amount);

    // Constructor to initialize the owner
    constructor() {
        owner = msg.sender;
    }

    function currentTimeStamp() public view returns(uint256) {
        return block.timestamp;
    }

    // Function to get all available donation projects
    function getDonationReadyProjects() public view returns (uint256[] memory) {
        console.log("Called `getDonationReadyProjects()`");
        uint256[] memory donationReadyProjects = new uint256[](latestDonationProjectId);

        uint256 currentTimestamp = block.timestamp;
        uint256 count = 0;

        for (uint256 i = 0; i < latestDonationProjectId; i++) {
            console.log("We are going through contracts");
            DonationProject storage currentDonationProject = donationProjects[i];
            if (currentDonationProject.donationPeriodType == DonationPeriodType.STRICT) {
                console.log("We found a strict contract");
                if (
                    currentTimestamp > currentDonationProject.startDonationDate &&
                    currentTimestamp < currentDonationProject.endDonationDate &&
                    currentDonationProject.isApproved &&
                    currentDonationProject.isOpenForDonations
                ) {
                    console.log("We found a ready project");
                    donationReadyProjects[count] = i;
                    count++;
                }
            } else {
                if (
                    currentDonationProject.isApproved &&
                    currentDonationProject.isOpenForDonations
                ) {
                    console.log("We found a ready projo");
                    donationReadyProjects[count] = i;
                    count++;
                }
            }
        }

        return donationReadyProjects;
    }

    // Function to make a donation to a project
    function makeDonation(uint256 projectId)
    public
    payable
    onlyApprovedProject(projectId)
    projectSafeForDonation(projectId)
    returns (bool)
    {
        // Check if donation amount is greater than zero
        uint256 donationAmount = msg.value;
        require(donationAmount > 0, "Donation amount must be greater than zero");

        // Get the donation project from storage
        DonationProject storage currentDonationProject = donationProjects[projectId];

        // Update the total donations for the project
        currentDonationProject.totalAmountDonated += donationAmount;

        // Update the total donations by the sender
        if (currentDonationProject.totalDonationsByAddress[msg.sender] == 0) {
            // If this is the sender's first donation, add them to the donors list
            currentDonationProject.donors.push(msg.sender);
        }
        currentDonationProject.totalDonationsByAddress[msg.sender] += donationAmount;

        // Emit an event to log the donation
        emit DonationMade(projectId, msg.sender, donationAmount);

        return true;
    }

    // Function to create a donation project
    function createDonationProject(
        DonationPeriodType _donationPeriodType,
        address[] memory _originalOrganizers,
        uint256 _donationTarget,
        uint256 _startDate,
        uint256 _endDate
    ) public {
        require(_donationTarget > 0, "Donation target has to be greater than 0");

        address[] storage organizers = donationProjects[latestDonationProjectId + 1].organizers;

        for (uint256 i = 0; i < _originalOrganizers.length;) {
            organizers.push(_originalOrganizers[i]);
        }

        bool isOwnerInOriginalOrganizers = false;
        for (uint8 i = 0; i < _originalOrganizers.length; i++) {
            if (msg.sender == _originalOrganizers[i]) {
                isOwnerInOriginalOrganizers = true;
                break;
            }
        }

        if (!isOwnerInOriginalOrganizers) {
            organizers.push(msg.sender);
        }

        uint256 currentId = latestDonationProjectId + 1;

        DonationProject storage donationProject = donationProjects[latestDonationProjectId];
        donationProject.donationPeriodType = _donationPeriodType;
        donationProject.organizers = organizers;
        donationProject.donationTarget = _donationTarget;
        donationProject.isApproved = false;
        donationProject.isOpenForDonations = true;
        donationProject.startDonationDate = _startDate;
        donationProject.endDonationDate = _endDate;

        latestDonationProjectId++;

        emit DonationProjectCreated(currentId, _originalOrganizers, _donationTarget);
    }

    // Function to approve a created donation project
    function approveCreatedDonationProject(uint256 projectId) public onlyOwnerOrStaff projectExists(projectId) projectIsNotApproved(projectId) {
        DonationProject storage donationProject = donationProjects[projectId];
        donationProject.isApproved = true;

        emit DonationProjectApproved(projectId);
    }

    // Function to create a new withdrawal request
    function createWithdrawalRequest(
        uint256 projectId,
        uint256 amount
    ) public onlyOrganizer(projectId) projectIsClosedForDonations(projectId) {

        WithdrawalRequest storage newRequest = withdrawalRequests[projectId][latestWithdrawRequestId];
        newRequest.withdrawalRequestStatus = WithdrawalRequestStatus.New;
        newRequest.owner = msg.sender;
        newRequest.withdrawAmount = amount;
        newRequest.numberOfApprovals = 0;
        newRequest.numberOfRejections = 0;

        emit WithdrawalRequestCreated(projectId, latestWithdrawRequestId, amount);

        latestWithdrawRequestId++;
    }

    // Function to approve a withdrawal request
    function approveWithdrawalRequest(
        uint256 projectId,
        uint256 requestId
    ) public onlyDonaApprovalCommitteeMember(projectId) requestSafeForVoting(projectId, requestId) {
        WithdrawalRequest storage request = withdrawalRequests[projectId][requestId];
        require(request.withdrawalRequestStatus == WithdrawalRequestStatus.New, "Request is not new");
        request.approvals.push(msg.sender);
        request.numberOfApprovals++;

        emit WithdrawalRequestApproved(projectId, requestId, msg.sender);

        // Check if request has already got enough votes for it to pass
        DonationProject storage currentDonationProject = donationProjects[projectId];
        uint256 votesNeeded = currentDonationProject.totalDonaApprovalCommitteeMembers / 2;
        if (request.numberOfApprovals > votesNeeded) {
            // Update state to Approved
            finalizeApprovalByCommittee(request);
        }
    }

    // Function to reject a withdrawal request
    function rejectWithdrawalRequest(
        uint256 projectId,
        uint256 requestId
    ) public onlyDonaApprovalCommitteeMember(projectId) requestSafeForVoting(projectId, requestId) {
        WithdrawalRequest storage request = withdrawalRequests[projectId][requestId];
        require(request.withdrawalRequestStatus == WithdrawalRequestStatus.New, "Request is not new");
        request.rejections.push(msg.sender);
        request.numberOfRejections++;

        emit WithdrawalRequestRejected(projectId, requestId, msg.sender);
    }

    // This executes a recalculation of approvals and rejections to ensure that approvals or rejections have not exceeded the number
    function recalculateWithdrawalRequestVotes(
        uint256 _projectId,
        uint256 _requestId
    ) public {
        DonationProject storage currentDonationProject = donationProjects[_projectId];
        WithdrawalRequest storage request = withdrawalRequests[_projectId][_requestId];

        uint256 votesNeeded = currentDonationProject.totalDonaApprovalCommitteeMembers / 2;
        if (request.numberOfApprovals > votesNeeded) {
            // Update state to Approved
            finalizeApprovalByCommittee(request);
        } else {
            // Update state to Rejected
            finalizeRejectionByCommittee(request);
        }
    }

    // Is called whenever enough votes are considered to have approved the request
    function finalizeApprovalByCommittee(
        WithdrawalRequest storage _withdrawalRequest
    ) private {
        _withdrawalRequest.withdrawalRequestStatus = WithdrawalRequestStatus.ApprovedByCommittee;

        emit WithdrawalRequestApproved(_withdrawalRequest.projectId, _withdrawalRequest.withdrawAmount, msg.sender);
    }

    // Is called whenever enough votes are considered to have rejected the request
    function finalizeRejectionByCommittee(
        WithdrawalRequest storage _withdrawalRequest
    ) private {
        _withdrawalRequest.withdrawalRequestStatus = WithdrawalRequestStatus.Rejected;

        emit WithdrawalRequestRejected(_withdrawalRequest.projectId, _withdrawalRequest.withdrawAmount, msg.sender);
    }

    // This function is used by DonaStaff to fully approve a Withdrawal Request
    function fullyApproveWithdrawalRequest(
        uint256 _projectId,
        uint256 _requestId
    ) public onlyOwnerOrStaff {
        WithdrawalRequest storage request = withdrawalRequests[_projectId][_requestId];

        require(request.withdrawalRequestStatus == WithdrawalRequestStatus.ApprovedByCommittee, "You can only fully approve a request approved by the committee");

        request.withdrawalRequestStatus = WithdrawalRequestStatus.FullyApproved;

        emit WithdrawalRequestFinalized(_projectId, _requestId, WithdrawalRequestStatus.FullyApproved);
    }

    // This function is called after the donation period has elapsed
    function finalizeDonations(uint256 _projectId) public onlyOrganizer(_projectId) {
        DonationProject storage project = donationProjects[_projectId];

        // require(block.timestamp > project.endDonationDate, "Donation period has not ended yet");
        require(project.isOpenForDonations, "Donations are already closed");

        project.isOpenForDonations = false;

        // Ensure there are donors to process
        uint256 donorCount = project.donors.length;
        require(donorCount > 0, "No donors to process");

        // Arrays to store donor information
        address[] memory contributors = new address[](donorCount);
        uint256[] memory donations = new uint256[](donorCount);

        // Fill arrays with contributors and their donation amounts
        for (uint256 i = 0; i < donorCount; i++) {
            address donor = project.donors[i];
            contributors[i] = donor;
            donations[i] = project.totalDonationsByAddress[donor];
        }

        // Sort contributors by donation amount (bubble sort for simplicity)
        for (uint256 i = 0; i < donorCount - 1; i++) {
            for (uint256 j = 0; j < donorCount - i - 1; j++) {
                if (donations[j] < donations[j + 1]) {
                    // Swap donations
                    (donations[j], donations[j + 1]) = (donations[j + 1], donations[j]);

                    // Swap contributors
                    (contributors[j], contributors[j + 1]) = (contributors[j + 1], contributors[j]);
                }
            }
        }

        // Select top 5% contributors
        uint256 topContributorsCount = (donorCount * 5) / 100;
        for (uint256 i = 0; i < topContributorsCount; i++) {
            project.topContributors.push(contributors[i]);
        }

        // Select random contributors (remaining donors)
        uint256 remainingContributorsCount = donorCount - topContributorsCount;
        require(remainingContributorsCount > 0, "Not enough donors to select random contributors");

        address[] memory potentialRandomContributors = new address[](remainingContributorsCount);
        uint256 index = 0;
        for (uint256 i = topContributorsCount; i < donorCount; i++) {
            potentialRandomContributors[index++] = contributors[i];
        }

        // For simplicity, use the remaining contributors as random contributors
        for (uint256 i = 0; i < topContributorsCount; i++) {
            project.randomContributors.push(potentialRandomContributors[i]);
        }

        // Calculate the total Dona Approval Committee members
        project.totalDonaApprovalCommitteeMembers = uint8(
            project.topContributors.length + project.randomContributors.length + project.organizers.length
        );

        emit DonationProjectFinalized(_projectId);
    }



    // Function to execute a withdrawal request
    function executeWithdrawal(
        uint256 projectId,
        uint256 requestId
    ) public onlyOrganizer(projectId) {
        WithdrawalRequest storage request = withdrawalRequests[projectId][requestId];

        require(request.withdrawalRequestStatus == WithdrawalRequestStatus.FullyApproved, "Request is not approved");

        DonationProject storage project = donationProjects[projectId];
        require(project.totalAmountDonated >= request.withdrawAmount, "Insufficient funds");

        payable(request.owner).transfer(request.withdrawAmount);
        project.totalAmountDonated -= request.withdrawAmount;
        request.withdrawalRequestStatus = WithdrawalRequestStatus.Withdrawn;

        emit WithdrawalExecuted(projectId, requestId, request.withdrawAmount);
    }
}
