import React, {useEffect, useState} from "react";
import {FaFileUpload} from "react-icons/fa";

import DonaThetaArtifactEtherApi from "../../../scripts/DonaThetaArtifactEtherApi";
import WithdrawalRequestOrganizerTable from "../../tables/WithdrawalRequestOrganizerTable";
import MediaItemsOrganizersTable from "../../tables/MediaItemsOrganizersTable";
import AddMediaItemDialog from "../../dialogs/AddMediaItemDialog";
import WithdrawalRequestStatus from "../../../models/WithdrawalRequestStatus";


export default function ProjectOrganizersTab({
                                                 project,
                                                 contract,
                                                 walletAddress,
                                                 isDonaStaff,
                                                 isOrganizer,
                                                 isCommitteeMember,
                                                 showCreateWithdrawalRequestDialog,
                                                 reQueryProject
                                             }) {

    const [isLoading, setIsLoading] = useState(false);

    const [showAddMediaItemDialog, setShowAddMediaItemDialog] = useState(false);
    const [showWithdrawalRequestDialog, setShowWithdrawalRequestDialog] = useState(null);
    const [showApproveRequestDialog, setShowApproveRequestDialog] = useState(null);

    const [finalizedWithdrawalRequests, setFinalizedWithdrawalRequests] = useState([]);
    const [newWithdrawalRequests, setNewWithdrawalRequests] = useState([]);
    const [rejectedWithdrawalRequests, setRejectedWithdrawalRequests] = useState([]);

    const [allImageMediaItems, setAllImageMediaItems] = useState([]);
    const [allDocumentMediaItems, setAllDocumentMediaItems] = useState([]);
    const [allLiveStreamMediaItems, setAllLiveStreamMediaItems] = useState([]);
    const [allVideoMediaItems, setAllVideoMediaItems] = useState([]);

    useEffect(() => {
        queryPageContent()
    }, [project]);

    const queryPageContent = async () => {
        setIsLoading(true);

        await queryWithdrawalRequests();

        await queryMediaItems();

        setIsLoading(false);
    }

    // Function to query media items
    const queryMediaItems = async () => {
        try {
            const images = await DonaThetaArtifactEtherApi.queryDonationProjectImageItems(contract, project.projectId);
            const documents = await DonaThetaArtifactEtherApi.queryDonationProjectDocumentItems(contract, project.projectId);
            const videos = await DonaThetaArtifactEtherApi.queryDonationProjectVideoItems(contract, project.projectId);
            const liveStreams = await DonaThetaArtifactEtherApi.queryDonationProjectLiveStreamItems(contract, project.projectId);

            setAllImageMediaItems(images);
            setAllDocumentMediaItems(documents);
            setAllVideoMediaItems(videos);
            setAllLiveStreamMediaItems(liveStreams);
        } catch (e) {
            console.error("Failed to query media items:", e);
        }
    }

    // Function to query withdrawal requests
    const queryWithdrawalRequests = async () => {
        try {
            const newRequests = []
            const rejectedRequests = []
            const finalizedWithdrawalRequests = []

            for (let i = 0; i < project.numberOfWithdrawalRequests; i++) {
                const withdrawalRequest = await DonaThetaArtifactEtherApi.queryWithdrawRequest(contract, project.projectId, i);

                switch (withdrawalRequest.withdrawalRequestStatus) {
                    case WithdrawalRequestStatus.NEW:
                        newRequests.push(withdrawalRequest);
                        break;
                    case WithdrawalRequestStatus.REJECTED:
                        rejectedRequests.push(withdrawalRequest);
                        break;
                    case WithdrawalRequestStatus.WITHDRAWN:
                        finalizedWithdrawalRequests.push(withdrawalRequest);
                        break;
                    case WithdrawalRequestStatus.APPROVED_BY_COMMITTEE:
                        finalizedWithdrawalRequests.push(withdrawalRequest);
                        break;

                }
            }

            setFinalizedWithdrawalRequests(finalizedWithdrawalRequests);
            setNewWithdrawalRequests(newRequests);
            setRejectedWithdrawalRequests(rejectedRequests);
        } catch (e) {
            console.error("Failed to query withdrawal requests:", e);
        }
    }

    const handleFinalizeProject = async () => {
        try {
            const fin = await DonaThetaArtifactEtherApi
        } catch(e) {
            console.log("OrganizersPage")
            alert("Failed to finalize project");
        }
    }


    //<editor-fold desc="Media Item Functions">

    const addMediaItemUsingUrl = async (
        mediaItemType,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) => {
        try {
            if (mediaItemType === "0") {
                await DonaThetaArtifactEtherApi.addDonationProjectImageItem(
                    contract,
                    project.projectId,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else if (mediaItemType === "1") {
                await DonaThetaArtifactEtherApi.addDonationProjectDocumentItem(
                    contract,
                    project.projectId,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else if (mediaItemType === "2") {
                await DonaThetaArtifactEtherApi.addDonationProjectVideoItem(
                    contract,
                    project.projectId,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else if (mediaItemType === "3") {
                await DonaThetaArtifactEtherApi.addDonationProjectLiveStreamItem(
                    contract,
                    project.projectId,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else {
                alert("Invalid media item type");
            }
        } catch (e) {
            alert("Error adding Media Item");
        }
    }


    const updateMediaItem = async (
        mediaItemType,
        mediaItemIndex,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) => {
        try {
            if (mediaItemType === 0) {
                await DonaThetaArtifactEtherApi.editDonationProjectImageItem(
                    contract,
                    project.projectId,
                    mediaItemIndex,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else if (mediaItemType === 1) {
                await DonaThetaArtifactEtherApi.editDonationProjectDocumentItem(
                    contract,
                    project.projectId,
                    mediaItemIndex,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else if (mediaItemType === 2) {
                await DonaThetaArtifactEtherApi.editDonationProjectVideoItem(
                    contract,
                    project.projectId,
                    mediaItemIndex,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else if (mediaItemType === 3) {
                await DonaThetaArtifactEtherApi.editDonationProjectLiveStreamItem(
                    contract,
                    project.projectId,
                    mediaItemIndex,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            }
        } catch (e) {
            alert("Failed to update media item");
        }
    }

    const deleteMediaItem = async (
        mediaItemType,
        mediaItemIndex
    ) => {
        try {
            if (mediaItemType === 0) {
                await DonaThetaArtifactEtherApi.deleteDonationProjectImageItem(
                    contract,
                    project.projectId,
                    mediaItemIndex
                )
            } else if (mediaItemType === 1) {
                await DonaThetaArtifactEtherApi.deleteDonationProjectDocumentItem(
                    contract,
                    project.projectId,
                    mediaItemIndex
                )
            } else if (mediaItemType === 2) {
                await DonaThetaArtifactEtherApi.deleteDonationProjectVideoItem(
                    contract,
                    project.projectId,
                    mediaItemIndex
                )
            } else if (mediaItemType === 3) {
                await DonaThetaArtifactEtherApi.deleteDonationProjectLiveStreamItem(
                    contract,
                    project.projectId,
                    mediaItemIndex
                )
            }
        } catch (e) {
            alert("Failed to update media item");
        }
    }

    //</editor-fold>

    const approveProject = async () => {
        try {
            await DonaThetaArtifactEtherApi.approveDonationProject(contract, project.projectId);
            reQueryProject()
        } catch (e) {
            alert("Failed to approve project");
        }
    }

    //<editor-fold desc="Dialogs">

    const WithdrawalRequestDialog = ({
                                         name,
                                         description,
                                         withdrawalAmount,
                                         numberOfApprovals,
                                         numberOfRejections,
                                         owner,
                                         onExit = () => {
                                         },
                                         onViewApprovals = () => {
                                         },
                                         onViewRejections = () => {
                                         }
                                     }) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl text-white mb-4">Withdrawal Request Details</h2>
                    <p className="text-white mb-2">
                        <strong>Name:</strong> {name}
                    </p>
                    <p className="text-white mb-2">
                        <strong>Description:</strong> {description}
                    </p>
                    <p className="text-white mb-2">
                        <strong>Withdrawal Amount (ETH):</strong> {withdrawalAmount}
                    </p>
                    <p className="text-white mb-2">
                        <strong>Owner:</strong> {owner}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-white">
                            <strong>Approvals:</strong> {numberOfApprovals}
                        </p>
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                            onClick={onViewApprovals}
                        >
                            View
                        </button>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-white">
                            <strong>Rejections:</strong> {numberOfRejections}
                        </p>
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                            onClick={onViewRejections}
                        >
                            View
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            onClick={onExit}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    const ApprovalAddressesDialog = ({
                                         title,
                                         addresses = [],
                                         onExit = () => {
                                         }
                                     }) => {
        const handleCopy = (address) => {
            navigator.clipboard.writeText(address);
            alert(`Copied: ${address}`);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl text-white mb-4">{title}</h2>
                    <table className="w-full mb-4">
                        <thead>
                        <tr>
                            <th className="text-left text-white">Address</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {addresses.map((address, index) => (
                            <tr key={index} className="border-b border-gray-700">
                                <td className="text-white">{address}</td>
                                <td>
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                                        onClick={() => handleCopy(address)}
                                    >
                                        Copy
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            onClick={onExit}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    //</editor-fold>

    return (
        <div className="bg-gray-950">
            <div className="">
                {isDonaStaff && !project.isApproved && (<div>
                        <div
                            className="rounded-xl shadow-md mb-4 flex flex-col items-center mx-6 p-2 border border-blue-900">
                            <h3 className="text-lg font-bold mb-2">Approve Project</h3>
                            <p className="text-center my-2">
                                Please review all details carefully before approving. Ensure that the project clearly
                                outlines its goals and objectives. Additionally, if possible, check the validity of the
                                project.
                            </p>
                            <button
                                className="px-3 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
                                onClick={approveProject}
                            >
                                Approve Project
                            </button>
                        </div>
                    </div>
                )}

                {!project.isFinalized && project.isApproved && (
                    <div className="w-fit fex flex-col items-center rounded-xl p-2 border border-blue-800">
                        <h6 className="font-bold text-xl">Finalize Project</h6>
                        <p className="text-center my-4">Do you wish to finalize the project? This action will open up the project to withdrawal request.</p>
                        <div className="">
                            <button
                                className="bg-blue-900 hover:bg-blue-600 rounded-lg px-4 py-1 my-2"
                                onClick={handleFinalize}
                            >
                                Finalize
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-row items-center">
                    <h2 className="text-xl mx-auto w-fit font-bold">Withdrawal Requests</h2>

                    {isOrganizer && project.isApproved && (
                        <button
                            onClick={() => {
                                showCreateWithdrawalRequestDialog()
                            }}
                            className="px-3 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
                        >
                            Create Request
                        </button>
                    )}
                </div>

                {newWithdrawalRequests.length > 0 && (
                    <div className="">
                        <h6 className="text-lg mx-auto w-fit font-bold">New Withdrawal Request</h6>
                        <WithdrawalRequestOrganizerTable
                            className=""
                            withdrawalRequests={newWithdrawalRequests}
                        />
                    </div>
                )}

                {finalizedWithdrawalRequests.length > 0 && (
                    <div className="">
                        <h6 className="">Finalized Withdrawal Request</h6>
                        <WithdrawalRequestOrganizerTable
                            className=""
                            withdrawalRequests={finalizedWithdrawalRequests}
                        />
                    </div>
                )}



                {rejectedWithdrawalRequests.length > 0 && (
                    <div className="">
                        <h6 className="">Rejected Withdrawal Request</h6>
                        <WithdrawalRequestOrganizerTable
                            className=""
                            withdrawalRequests={rejectedWithdrawalRequests}
                        />
                    </div>
                )}

            </div>


            <div className="mt-4">
                <div className="flex flex-row items-center">
                    <h2 className="text-xl mx-auto w-fit font-bold">Media Items</h2>

                    {isOrganizer && (
                        <button
                            onClick={() => {
                                setShowAddMediaItemDialog(true);
                            }}
                            className="px-3 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
                        >
                            Create Media Item
                        </button>
                    )}
                </div>

                {allImageMediaItems.length > 0 && (
                    <>
                        <h6 className="text-lg mx-auto w-fit font-bold">Images</h6>
                        <MediaItemsOrganizersTable
                            className=""
                            mediaItems={allImageMediaItems}
                        />
                    </>
                )}

                {allDocumentMediaItems.length > 0 && (
                    <>
                        <h6 className="text-lg mx-auto w-fit font-bold">Documents</h6>
                        <MediaItemsOrganizersTable
                            className=""
                            mediaItems={allDocumentMediaItems}
                        />
                    </>
                )}

                {allVideoMediaItems.length > 0 && (
                    <>
                        <h6 className="text-lg mx-auto w-fit font-bold">Videos</h6>
                        <MediaItemsOrganizersTable
                            className=""
                            mediaItems={allVideoMediaItems}
                        />
                    </>
                )}

                {allLiveStreamMediaItems.length > 0 && (
                    <>
                        <h6 className="text-lg mx-auto w-fit font-bold">Live Streams</h6>
                        <MediaItemsOrganizersTable
                            className=""
                            mediaItems={allLiveStreamMediaItems}
                        />
                    </>

                )}

            </div>

            {showAddMediaItemDialog && (
                <AddMediaItemDialog
                    fileName={`file_project_${project.projectId}`}
                    onSubmitted={(mediaItemType, mediaItemName, mediaItemDescription, mediaItemUrl) => {
                        addMediaItemUsingUrl(
                            mediaItemType,
                            mediaItemName,
                            mediaItemDescription,
                            mediaItemUrl
                        ).then(() => {
                            setShowAddMediaItemDialog(false)
                            reQueryProject()
                        });
                    }}
                    onExit={() => {
                        setShowAddMediaItemDialog(false);
                    }}
                />
            )}

            {showWithdrawalRequestDialog && (
                <WithdrawalRequestDialog
                    name={showApproveRequestDialog.requestName}
                    description={showApproveRequestDialog.requestDescription}
                    withdrawalAmount={showApproveRequestDialog.withdrawalAmount}
                    numberOfApprovals={showApproveRequestDialog.numberOfApprovals}
                    numberOfRejections={showApproveRequestDialog.numberOfRejections}
                    owner={showApproveRequestDialog.owner}
                    onExit={() => {
                        setShowWithdrawalRequestDialog(null);
                    }}
                    onViewApprovals={() => {
                        // Handle viewing approvals
                    }}
                    onViewRejections={() => {
                        // Handle viewing rejections
                    }}
                />
            )}
        </div>
    );

}
