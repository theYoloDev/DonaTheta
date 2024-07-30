// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "hardhat/console.sol";

// This is the piggy bank for a donation project
contract DonaTheta {
    // Dona organizers
    address payable public owner;
    address[] private donaStaff;

    uint256 public numberOfDonationProjects = 0;

    // Total Target Amount
    uint256 public totalTargetAmount = 0;

    // Amount of funds donated
    uint256 public totalDonationsReceived = 0;

    // Amount of funds withdrawn
    uint256 public totalDonationsUtilized = 0;

    uint256[] private unapprovedDonationProjects;

    // Mapping to store donation projects with a unique ID
    mapping(uint256 => DonationProject) private donationProjects;
    // Mapping from donation project to withdrawal request with a unique ID
    mapping(uint256 => mapping(uint256 => WithdrawalRequest)) private withdrawalRequests;
    // Mapping that matches user's address to ID of projects where they are organizers
    mapping(address => uint256[]) private organizingProjects;
    // Mapping that matches user's address to ID of projects they are member's of the committee
    mapping(address => uint256[]) private committeeProjects;

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
                    break;
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

    modifier onlyOrganizerOrDonaStaff(uint256 projectId) {
        DonationProject storage currentDonationProject = donationProjects[projectId];

        bool isOrganizerOrDonaStaff = msg.sender == owner;

        if (!isOrganizerOrDonaStaff) {
            for (uint8 i = 0; i < currentDonationProject.organizers.length;) {
                if (msg.sender == currentDonationProject.organizers[i]) {
                    isOrganizerOrDonaStaff = true;
                    break;
                }
                unchecked {i++;}
            }
        }

        if (!isOrganizerOrDonaStaff) {
            for (uint i = 0; i < donaStaff.length;) {
                if (msg.sender == donaStaff[i]) {
                    isOrganizerOrDonaStaff = true;
                }
                unchecked {i++;}
            }
        }

        require(isOrganizerOrDonaStaff, "The action can only be performed by organizers of the project");
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
        Rejected,
        Withdrawn
    }

    enum MediaItemType {
        Image,
        Document,
        Video,
        LiveStream
    }

    // Struct representing media items
    struct MediaItem {
        string mediaItemName;
        string mediaItemDescription;
        MediaItemType mediaItemType;
        string mediaItemUrl;
    }

    // Struct to represent a single withdrawal request
    struct WithdrawalRequest {
        uint256 projectId;                                // The projectId of the project
        WithdrawalRequestStatus withdrawalRequestStatus;  // Status of the withdrawal request
        address owner;                                    // Owner of the request

        string requestName;                               // The name of the Withdrawal Request
        string requestDescription;                        // A description of the Withdrawal Request

        MediaItem[] images;                               // Supporting Images
        MediaItem[] documents;                            // Supporting Documents
        MediaItem[] videos;                               // Supporting Videos
        MediaItem[] liveStreams;                          // Supporting LiveStreams

        uint256 withdrawAmount;                           // Amount to be withdrawn
        uint256 numberOfApprovals;                        // Number of approvals
        uint256 numberOfRejections;                       // Number of rejections
        address[] approvals;                              // List of addresses that approved
        address[] rejections;                             // List of addresses that rejected
    }

    // Struct to represent a single donation project
    struct DonationProject {
        uint256 projectId;                                      // The projectId
        DonationPeriodType donationPeriodType;                  // The strictness of donation periods
        string projectName;                                     // The name of the project
        string projectDescription;                              // The description of the project
        address[] organizers;                                   // The Organizers of the Donation Project
        uint256 donationTarget;                                 // The donation target of the project
        uint256 startDonationDate;                              // Start DateTime of the donations (Epoch Seconds)
        uint256 endDonationDate;                                // End DateTime of the donations (Epoch Seconds)

        MediaItem[] images;                                     // Supporting Images
        MediaItem[] documents;                                  // Supporting Documents
        MediaItem[] videos;                                     // Supporting Videos
        MediaItem[] liveStreams;                                // Supporting LiveStreams

        bool isApproved;                                        // Whether or not the project is approved by DonaTheta Organizers
        bool isFinalized;                                // The project is open for donations
        uint256 numberOfWithdrawalRequests;                     // The number of withdrawal requests

        address[] donors;                                       // Number of donors
        uint256 totalAmountDonated;                             // Total amount donated
        uint256 totalAmountWithdrawn;                           // Total amount withdrawn
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
    event WithdrawalExecuted(uint256 indexed projectId, uint256 requestId, uint256 amount);

    // Constructor to initialize the owner
    constructor() payable {
        owner = payable(msg.sender);
    }

    // Function to create a new donation project
    function createDonationProject(
        DonationPeriodType donationPeriodType,
        string memory projectName,
        string memory projectDescription,
        address[] memory organizers,
        uint256 donationTarget,
        uint256 startDonationDate,
        uint256 endDonationDate
    ) public {
        DonationProject storage newDonationProject = donationProjects[numberOfDonationProjects];
        newDonationProject.donationPeriodType = donationPeriodType;
        newDonationProject.projectName = projectName;
        newDonationProject.projectDescription = projectDescription;

        // Check if msg.sender is part of organizers, if not add it
        bool isOrganizer = false;
        for (uint i = 0; i < organizers.length; i++) {
            if (organizers[i] == msg.sender) {
                isOrganizer = true;
                break;
            }
        }

        if (!isOrganizer) {
            address[] memory updatedOrganizers = new address[](organizers.length + 1);
            for (uint i = 0; i < organizers.length; i++) {
                updatedOrganizers[i] = organizers[i];
            }
            updatedOrganizers[organizers.length] = msg.sender;
            newDonationProject.organizers = updatedOrganizers;
        } else {
            newDonationProject.organizers = organizers;
        }

        newDonationProject.projectId = numberOfDonationProjects;
        newDonationProject.donationTarget = donationTarget;
        newDonationProject.startDonationDate = startDonationDate;
        newDonationProject.endDonationDate = endDonationDate;
        newDonationProject.isApproved = false;
        newDonationProject.isFinalized = false;
        newDonationProject.totalAmountDonated = 0;
        newDonationProject.totalAmountWithdrawn = 0;

        totalTargetAmount += donationTarget;

        for (uint i = 0; i < newDonationProject.organizers.length; i++) {
            organizingProjects[newDonationProject.organizers[i]].push(numberOfDonationProjects);
            committeeProjects[newDonationProject.organizers[i]].push(numberOfDonationProjects);
        }


        unapprovedDonationProjects.push(numberOfDonationProjects);

//        emit DonationProjectCreated(numberOfDonationProjects, newDonationProject.organizers, donationTarget);

        numberOfDonationProjects = numberOfDonationProjects + 1;
    }

    // Function to approve a donation project
    function approveDonationProject(uint256 projectId)
    public
    onlyOwnerOrStaff
    projectIsNotApproved(projectId)
    {
        DonationProject storage currentDonationProject = donationProjects[projectId];
        currentDonationProject.isApproved = true;

        // Remove projectId from unapprovedDonationProjects
        for (uint256 i = 0; i < unapprovedDonationProjects.length; i++) {
            if (unapprovedDonationProjects[i] == projectId) {
                unapprovedDonationProjects[i] = unapprovedDonationProjects[unapprovedDonationProjects.length - 1];
                unapprovedDonationProjects.pop();
                break;
            }
        }

        emit DonationProjectApproved(projectId);
    }

    // Function to donate to a project
    function makeDonation(uint256 projectId) public payable {
        DonationProject storage currentDonationProject = donationProjects[projectId];

        owner.transfer(msg.value);

        currentDonationProject.donors.push(msg.sender);
        currentDonationProject.totalAmountDonated += msg.value;
        currentDonationProject.totalDonationsByAddress[msg.sender] += msg.value;

        totalDonationsReceived += msg.value;

        emit DonationMade(projectId, msg.sender, msg.value);
    }

    // This function is called after the donation period has elapsed
    function finalizeDonations(uint256 _projectId) public onlyOrganizer(_projectId) {
        DonationProject storage project = donationProjects[_projectId];

        // Remove require for donation period check
        if (!project.isFinalized) {
            // If donations are already closed, just return
            return;
        }

        project.isFinalized = false;

        // Ensure there are donors to process
        uint256 donorCount = project.donors.length;
        if (donorCount == 0) {
            // No donors to process, mark the project as closed for donations
            return;
        }

        // Arrays to store donor information
        address[] memory contributors = new address[](donorCount);
        uint256[] memory donations = new uint256[](donorCount);

        // Fill arrays with contributors and their donation amounts
        for (uint256 i = 0; i < donorCount; i++) {
            address donor = project.donors[i];
            contributors[i] = donor;
            donations[i] = project.totalDonationsByAddress[donor];
        }

        if (donorCount > 10) {
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
                committeeProjects[contributors[i]].push(_projectId);
            }

            // Select random contributors (remaining donors)
            uint256 remainingContributorsCount = donorCount - topContributorsCount;
            if (remainingContributorsCount == 0) {
                // If there are no remaining contributors, exit the function
                return;
            }

            address[] memory potentialRandomContributors = new address[](remainingContributorsCount);
            uint256 index = 0;
            for (uint256 i = topContributorsCount; i < donorCount; i++) {
                potentialRandomContributors[index++] = contributors[i];
            }

            // Use the remaining contributors as random contributors
            for (uint256 i = 0; i < remainingContributorsCount; i++) {
                project.randomContributors.push(potentialRandomContributors[i]);
                committeeProjects[potentialRandomContributors[i]].push(_projectId);
            }
        } else {
            // If 10 or fewer donors, add all as random contributors
            for (uint256 i = 0; i < donorCount; i++) {
                project.randomContributors.push(contributors[i]);
                committeeProjects[contributors[i]].push(_projectId);
            }
        }

        // Calculate the total Dona Approval Committee members
        project.totalDonaApprovalCommitteeMembers = uint8(
            project.topContributors.length + project.randomContributors.length + project.organizers.length
        );

        emit DonationProjectFinalized(_projectId);
    }

    // Function to create a withdrawal request
    function createWithdrawalRequest(
        uint256 projectId,
        string memory requestName,
        string memory requestDescription,
        uint256 amount
    ) public onlyOrganizer(projectId) onlyApprovedProject(projectId)
    {
        uint256 numberOfWithdrawalRequestsInProject = donationProjects[projectId].numberOfWithdrawalRequests;
        WithdrawalRequest storage newWithdrawalRequest = withdrawalRequests[projectId][numberOfWithdrawalRequestsInProject];
        newWithdrawalRequest.projectId = projectId;
        newWithdrawalRequest.withdrawalRequestStatus = WithdrawalRequestStatus.New;
        newWithdrawalRequest.requestName = requestName;
        newWithdrawalRequest.requestDescription = requestDescription;
        newWithdrawalRequest.owner = msg.sender;
        newWithdrawalRequest.withdrawAmount = amount;

        donationProjects[projectId].numberOfWithdrawalRequests++;
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

        // Check if request has already got enough votes for it to pass
        DonationProject storage currentDonationProject = donationProjects[projectId];
        uint256 votesNeeded = currentDonationProject.totalDonaApprovalCommitteeMembers / 2;
        if (request.numberOfApprovals > votesNeeded) {
            // Update state to Approved
            request.withdrawalRequestStatus = WithdrawalRequestStatus.ApprovedByCommittee;
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

        // Check if request has already got enough votes for it to pass
        DonationProject storage currentDonationProject = donationProjects[projectId];
        uint256 votesNeeded = currentDonationProject.totalDonaApprovalCommitteeMembers / 2;
        if (request.numberOfRejections > votesNeeded) {
            // Update state to Approved
            request.withdrawalRequestStatus = WithdrawalRequestStatus.Rejected;
        }
    }

    // Function to withdraw funds from the contract
    function withdrawFunds(uint256 projectId, uint256 requestId)
    public
    onlyOrganizer(projectId)
    onlyApprovedProject(projectId)
    {
        WithdrawalRequest storage currentWithdrawalRequest = withdrawalRequests[projectId][requestId];
        DonationProject storage currentDonationProject = donationProjects[projectId];

        require(currentWithdrawalRequest.withdrawalRequestStatus == WithdrawalRequestStatus.ApprovedByCommittee, "Request must be fully approved to withdraw funds");
        require((currentDonationProject.totalAmountDonated - currentDonationProject.totalAmountWithdrawn) >= currentWithdrawalRequest.withdrawAmount, "Insufficient funds in the project");

        currentDonationProject.totalAmountWithdrawn += currentWithdrawalRequest.withdrawAmount;
        totalDonationsUtilized += currentWithdrawalRequest.withdrawAmount;
        currentWithdrawalRequest.withdrawalRequestStatus = WithdrawalRequestStatus.Withdrawn;

        payable(currentWithdrawalRequest.owner).transfer(currentWithdrawalRequest.withdrawAmount);

        emit WithdrawalExecuted(projectId, requestId, currentWithdrawalRequest.withdrawAmount);
    }

    // ================================
    // ========= MEDIA ITEMS ==========
    // ================================

    // Function to get Donation Project Media Items
    function getDonationProjectMediaItems(uint256 projectId, MediaItemType mediaItemType) public view returns (MediaItem[] memory) {
        if (mediaItemType == MediaItemType.Image) {
            return donationProjects[projectId].images;
        } else if (mediaItemType == MediaItemType.Video) {
            return donationProjects[projectId].videos;
        } else if (mediaItemType == MediaItemType.Document) {
            return donationProjects[projectId].documents;
        } else if (mediaItemType == MediaItemType.LiveStream) {
            return donationProjects[projectId].liveStreams;
        } else {
            revert("Invalid media item type");
        }
    }

    // Function to add a Donation Project Media Item
    function addDonationProjectMediaItem(
        uint256 projectId,
        string memory mediaItemName,
        string memory mediaItemDescription,
        string memory mediaItemUrl,
        MediaItemType mediaItemType
    ) public onlyOrganizer(projectId) {
        MediaItem memory newMediaItem = MediaItem({
            mediaItemName: mediaItemName,
            mediaItemDescription: mediaItemDescription,
            mediaItemType: mediaItemType,
            mediaItemUrl: mediaItemUrl
        });

        if (mediaItemType == MediaItemType.Image) {
            donationProjects[projectId].images.push(newMediaItem);
        } else if (mediaItemType == MediaItemType.Video) {
            donationProjects[projectId].videos.push(newMediaItem);
        } else if (mediaItemType == MediaItemType.Document) {
            donationProjects[projectId].documents.push(newMediaItem);
        } else if (mediaItemType == MediaItemType.LiveStream) {
            donationProjects[projectId].liveStreams.push(newMediaItem);
        } else {
            revert("Invalid media item type");
        }
    }

    // Function to edit a Donation Project Media Item
    function editDonationProjectMediaItem(
        uint256 projectId,
        uint256 mediaItemIndex,
        string memory mediaItemName,
        string memory mediaItemDescription,
        string memory mediaItemUrl,
        MediaItemType mediaItemType
    ) public onlyOrganizer(projectId) {
        MediaItem[] storage mediaItems;

        if (mediaItemType == MediaItemType.Image) {
            mediaItems = donationProjects[projectId].images;
        } else if (mediaItemType == MediaItemType.Video) {
            mediaItems = donationProjects[projectId].videos;
        } else if (mediaItemType == MediaItemType.Document) {
            mediaItems = donationProjects[projectId].documents;
        } else if (mediaItemType == MediaItemType.LiveStream) {
            mediaItems = donationProjects[projectId].liveStreams;
        } else {
            revert("Invalid media item type");
        }

        require(mediaItemIndex < mediaItems.length, "Invalid Media Item Index");
        MediaItem storage mediaItem = mediaItems[mediaItemIndex];
        mediaItem.mediaItemName = mediaItemName;
        mediaItem.mediaItemDescription = mediaItemDescription;
        mediaItem.mediaItemUrl = mediaItemUrl;
    }

    // Function to delete a Donation Project Media Item
    function deleteDonationProjectMediaItem(
        uint256 projectId,
        uint256 mediaItemIndex,
        MediaItemType mediaItemType
    ) public onlyOwnerOrStaff {
        MediaItem[] storage mediaItems;

        if (mediaItemType == MediaItemType.Image) {
            mediaItems = donationProjects[projectId].images;
        } else if (mediaItemType == MediaItemType.Video) {
            mediaItems = donationProjects[projectId].videos;
        } else if (mediaItemType == MediaItemType.Document) {
            mediaItems = donationProjects[projectId].documents;
        } else if (mediaItemType == MediaItemType.LiveStream) {
            mediaItems = donationProjects[projectId].liveStreams;
        } else {
            revert("Invalid media item type");
        }

        require(mediaItemIndex < mediaItems.length, "Invalid Media Item Index");
        mediaItems[mediaItemIndex] = mediaItems[mediaItems.length - 1];
        mediaItems.pop();
    }

    // Function to get Withdrawal Request Media Items
    function getWithdrawalRequestMediaItems(uint256 projectId, uint256 requestId, MediaItemType mediaItemType) public view returns (MediaItem[] memory) {
        if (mediaItemType == MediaItemType.Image) {
            return withdrawalRequests[projectId][requestId].images;
        } else if (mediaItemType == MediaItemType.Video) {
            return withdrawalRequests[projectId][requestId].videos;
        } else if (mediaItemType == MediaItemType.Document) {
            return withdrawalRequests[projectId][requestId].documents;
        } else if (mediaItemType == MediaItemType.LiveStream) {
            return withdrawalRequests[projectId][requestId].liveStreams;
        } else {
            revert("Invalid media item type");
        }
    }

    // Function to add a Withdrawal Request Media Item
    function addWithdrawalRequestMediaItem(
        uint256 projectId,
        uint256 requestId,
        string memory mediaItemName,
        string memory mediaItemDescription,
        string memory mediaItemUrl,
        MediaItemType mediaItemType
    ) public onlyOrganizer(projectId) {
        MediaItem memory newMediaItem = MediaItem({
            mediaItemName: mediaItemName,
            mediaItemDescription: mediaItemDescription,
            mediaItemType: mediaItemType,
            mediaItemUrl: mediaItemUrl
        });

        if (mediaItemType == MediaItemType.Image) {
            withdrawalRequests[projectId][requestId].images.push(newMediaItem);
        } else if (mediaItemType == MediaItemType.Video) {
            withdrawalRequests[projectId][requestId].videos.push(newMediaItem);
        } else if (mediaItemType == MediaItemType.Document) {
            withdrawalRequests[projectId][requestId].documents.push(newMediaItem);
        } else if (mediaItemType == MediaItemType.LiveStream) {
            withdrawalRequests[projectId][requestId].liveStreams.push(newMediaItem);
        } else {
            revert("Invalid media item type");
        }
    }

    // Function to edit a Withdrawal Request Media Item
    function editWithdrawalRequestMediaItem(
        uint256 projectId,
        uint256 requestId,
        uint256 mediaItemIndex,
        string memory mediaItemName,
        string memory mediaItemDescription,
        string memory mediaItemUrl,
        MediaItemType mediaItemType
    ) public onlyOrganizer(projectId) {
        MediaItem[] storage mediaItems;

        if (mediaItemType == MediaItemType.Image) {
            mediaItems = withdrawalRequests[projectId][requestId].images;
        } else if (mediaItemType == MediaItemType.Video) {
            mediaItems = withdrawalRequests[projectId][requestId].videos;
        } else if (mediaItemType == MediaItemType.Document) {
            mediaItems = withdrawalRequests[projectId][requestId].documents;
        } else if (mediaItemType == MediaItemType.LiveStream) {
            mediaItems = withdrawalRequests[projectId][requestId].liveStreams;
        } else {
            revert("Invalid media item type");
        }

        require(mediaItemIndex < mediaItems.length, "Invalid Media Item Index");
        MediaItem storage mediaItem = mediaItems[mediaItemIndex];
        mediaItem.mediaItemName = mediaItemName;
        mediaItem.mediaItemDescription = mediaItemDescription;
        mediaItem.mediaItemUrl = mediaItemUrl;
    }

    // Function to delete a Withdrawal Request Media Item
    function deleteWithdrawalRequestMediaItem(
        uint256 projectId,
        uint256 requestId,
        uint256 mediaItemIndex,
        MediaItemType mediaItemType
    ) public onlyOwnerOrStaff {
        MediaItem[] storage mediaItems;

        if (mediaItemType == MediaItemType.Image) {
            mediaItems = withdrawalRequests[projectId][requestId].images;
        } else if (mediaItemType == MediaItemType.Video) {
            mediaItems = withdrawalRequests[projectId][requestId].videos;
        } else if (mediaItemType == MediaItemType.Document) {
            mediaItems = withdrawalRequests[projectId][requestId].documents;
        } else if (mediaItemType == MediaItemType.LiveStream) {
            mediaItems = withdrawalRequests[projectId][requestId].liveStreams;
        } else {
            revert("Invalid media item type");
        }

        require(mediaItemIndex < mediaItems.length, "Invalid Media Item Index");
        mediaItems[mediaItemIndex] = mediaItems[mediaItems.length - 1];
        mediaItems.pop();
    }


    //<editor-fold desc="MISCELLANEOUS">

    //<editor-fold desc="Donation Project">

    function getDonationProjectNumericalDetails(
        uint256 projectId,
        uint8 requestType
    ) public view returns(uint256) {
        if(requestType == 0) {
            return donationProjects[projectId].projectId;
        } else if (requestType == 1) {
            if (donationProjects[projectId].isApproved) {
                return 1;
            } else {
                return 0;
            }
        } else if (requestType == 2) {
            if (donationProjects[projectId].isFinalized) {
                return 1;
            } else {
                return 0;
            }
        } else if (requestType == 3) {
            return donationProjects[projectId].donationTarget;
        } else if (requestType == 4) {
            return donationProjects[projectId].totalAmountDonated;
        } else if (requestType == 5) {
            return donationProjects[projectId].totalAmountWithdrawn;
        } else if (requestType == 6) {
            return donationProjects[projectId].donors.length;
        } else if (requestType == 7) {
            return donationProjects[projectId].startDonationDate;
        } else if (requestType == 8) {
            return donationProjects[projectId].endDonationDate;
        } else if (requestType == 9) {
            return donationProjects[projectId].numberOfWithdrawalRequests;
        } else if (requestType == 10) {
            return donationProjects[projectId].totalDonationsByAddress[msg.sender];
        } else {
            revert("Invalid Request Type");
        }
    }

    function getDonationProjectTextDetails(
        uint256 projectId,
        uint256 requestType
    ) public view returns(string memory) {
        if(requestType == 0) {
            return donationProjects[projectId].projectName;
        } else if (requestType == 1) {
            return donationProjects[projectId].projectDescription;
        } else {
            revert("Invalid Request Type");
        }
    }

    function getDonationProjectAddressDetails(
        uint256 projectId,
        uint8 requestType
    ) public view returns(address[] memory) {
        if(requestType == 0) {
            return donationProjects[projectId].organizers;
        } else if (requestType == 1) {
            return donationProjects[projectId].donors;
        } else if (requestType == 2) {
            return donationProjects[projectId].topContributors;
        } else if (requestType == 2) {
            return donationProjects[projectId].randomContributors;
        } else {
            revert("Invalid Request Type");
        }
    }

    // Withdrawal Request


    function getWithdrawalRequestTextDetails(
        uint256 projectId,
        uint256 requestId,
        uint8 requestType
    ) public view returns(string memory) {
        if(requestType == 0) {
            return withdrawalRequests[projectId][requestId].requestName;
        } else if (requestType == 1) {
            return withdrawalRequests[projectId][requestId].requestDescription;
        } else {
            revert("Invalid Request Type");
        }
    }

    function getWithdrawalRequestNumericalDetails(
        uint256 projectId,
        uint256 requestId,
        uint8 requestType
    ) public view returns(uint256) {
        if(requestType == 0) {
            return withdrawalRequests[projectId][requestId].withdrawAmount;
        } else if (requestType == 1) {
            WithdrawalRequestStatus status = withdrawalRequests[projectId][requestId].withdrawalRequestStatus;

            if(status == WithdrawalRequestStatus.ApprovedByCommittee) {
                return 1;
            } else if(status == WithdrawalRequestStatus.Rejected) {
                return 2;
            } else if(status == WithdrawalRequestStatus.Withdrawn) {
                return 3;
            } else {
                return 0;
            }
        } else if (requestType == 2) {
            return withdrawalRequests[projectId][requestId].numberOfApprovals;
        } else if (requestType == 3) {
            return withdrawalRequests[projectId][requestId].numberOfRejections;
        } else if (requestType == 4) {
            return donationProjects[projectId].totalDonaApprovalCommitteeMembers;
        } else {
            revert("Invalid Request Type");
        }
    }

    function getWithdrawalRequestOwner(
        uint256 projectId,
        uint256 requestId
    ) public view returns(address) {
        return withdrawalRequests[projectId][requestId].owner;
    }

    function getWithdrawalRequestAddressesDetails(
        uint256 projectId,
        uint256 requestId,
        uint8 requestType
    ) public view returns(address[] memory) {
        if(requestType == 0) {
            return withdrawalRequests[projectId][requestId].approvals;
        } else if (requestType == 1) {
            return withdrawalRequests[projectId][requestId].rejections;
        } else {
            revert("Invalid Request Type");
        }
    }

    // Function to get the users organizing projects
    function getUserProjects(
        uint256 requestType
    ) public view returns(uint256[] memory) {
        if(requestType == 0) {
            return organizingProjects[msg.sender];
        } else if (requestType == 1) {
            return committeeProjects[msg.sender];
        } else {
            revert("Invalid Request Type");
        }
    }

    // Function to get unapproved Donation Projects
    function getUnapprovedDonationProjects() public view returns(uint256[] memory) {
        return unapprovedDonationProjects;
    }

    // This function ideally should not exist
    function addDonaStaffMember(address member) public {
        donaStaff.push(member);
    }

    function getDonaStaffMembers() public view returns(address[] memory) {
        return donaStaff;
    }

    // Function to check if user is member of staff
    function isUserDonaStaff() public view returns(bool) {
        bool isOwnerOrStaff = msg.sender == owner;

        if (!isOwnerOrStaff) {
            for (uint i = 0; i < donaStaff.length;) {
                if (msg.sender == donaStaff[i]) {
                    isOwnerOrStaff = true;
                    break;
                }
                unchecked {i++;}
            }
        }

        return isOwnerOrStaff;
    }
}
