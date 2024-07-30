import React, {useState, useEffect} from "react";
import DonaThetaArtifactEtherApi from "../../../scripts/DonaThetaArtifactEtherApi";
import MediaItemsOrganizersTable from "../../tables/MediaItemsOrganizersTable";
import WithdrawalRequestStatus from "../../../models/WithdrawalRequestStatus";
import AddMediaItemDialog from "../../dialogs/AddMediaItemDialog";
import {MdCancel} from "react-icons/md";

export default function WithdrawalRequestOrganizerTab({
      projectId,
      withdrawalRequest,
      contract,
      walletAddress,
      isOrganizer,
      isCommitteeMember,
      reQueryRequest
}) {
    const [voteCast, setVoteCast] = useState(null); // Whether null, Approved or Rejected
    const [isReadyForVoting, setIsReadyForVoting] = useState(false);
    const [showVotingDialog, setShowVotingDialog] = useState(false);


    const [showAddMediaItemDialog, setShowAddMediaItemDialog] = useState(false);

    const [allImageMediaItems, setAllImageMediaItems] = useState([]);
    const [allDocumentMediaItems, setAllDocumentMediaItems] = useState([]);
    const [allVideoMediaItems, setAllVideoMediaItems] = useState([]);
    const [allLiveStreamMediaItems, setAllLiveStreamMediaItems] = useState([]);

    useEffect(() => {
        checkIfUserHasVoted();
        queryMediaItems().then();
    }, [contract, withdrawalRequest]);

    const addMediaItemUsingUrl = async (
        mediaItemType,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) => {
        try {
            if (mediaItemType === "0") {
                await DonaThetaArtifactEtherApi.addWithdrawalRequestImageItem(
                    contract,
                    projectId,
                    withdrawalRequest.requestId,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else if (mediaItemType === "1") {
                await DonaThetaArtifactEtherApi.addWithdrawalRequestDocumentItem(
                    contract,
                    projectId,
                    withdrawalRequest.requestId,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else if (mediaItemType === "2") {
                await DonaThetaArtifactEtherApi.addWithdrawalRequestVideoItem(
                    contract,
                    projectId,
                    withdrawalRequest.requestId,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else if (mediaItemType === "3") {
                await DonaThetaArtifactEtherApi.addWithdrawalRequestLiveStreamItem(
                    contract,
                    projectId,
                    withdrawalRequest.requestId,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                )
            } else {
                alert("Cannot decode the media item type.")
            }
        } catch (e) {
            alert("Error adding Media Item");
        }
    }

    const checkIfUserHasVoted = () => {
        if (withdrawalRequest.withdrawalRequestStatus !== WithdrawalRequestStatus.NEW) {
            switch (withdrawalRequest.withdrawalRequestStatus) {
                case WithdrawalRequestStatus.APPROVED_BY_COMMITTEE:
                    setVoteCast("Approved");
                    break;
                case WithdrawalRequestStatus.REJECTED:
                    setVoteCast("Rejected");
                    break;
                case WithdrawalRequestStatus.WITHDRAWN:
                    setVoteCast("Withdrawn");
                    break;
            }
            setIsReadyForVoting(false);
        } else if (withdrawalRequest.approvals.includes(walletAddress)) {
            setVoteCast("Approved");
            setIsReadyForVoting(false);
        } else if (withdrawalRequest.rejections.includes(walletAddress)) {
            setVoteCast("Rejected");
            setIsReadyForVoting(false);
        } else {
            DonaThetaArtifactEtherApi.checkIfDonationProjectIsFinalized(contract, projectId).then(isFinalized => {
                setIsReadyForVoting(isFinalized);
            })
        }
    };

    const queryMediaItems = async () => {
        try {
            const images = await DonaThetaArtifactEtherApi.queryWithdrawalRequestImageItems(
                contract,
                projectId,
                withdrawalRequest.requestId
            );
            const documents = await DonaThetaArtifactEtherApi.queryWithdrawalRequestDocumentItems(
                contract,
                projectId,
                withdrawalRequest.requestId
            );
            const videos = await DonaThetaArtifactEtherApi.queryWithdrawalRequestVideoItems(
                contract,
                projectId,
                withdrawalRequest.requestId
            );
            const liveStreams = await DonaThetaArtifactEtherApi.queryWithdrawalRequestLiveStreamItems(
                contract,
                projectId,
                withdrawalRequest.requestId
            );

            setAllImageMediaItems(images);
            setAllDocumentMediaItems(documents);
            setAllVideoMediaItems(videos);
            setAllLiveStreamMediaItems(liveStreams);
        } catch (error) {
            alert("Error retrieving media items");
        }
    };

    const handleApprovalVote = async () => {
        try {
            await DonaThetaArtifactEtherApi.approveWithdrawalRequest(
                contract,
                projectId,
                withdrawalRequest.requestId
            );
            setVoteCast("Approved");
            setIsReadyForVoting(true);
        } catch (e) {
            alert("Failed to Approve WithdrawalRequest");
        }
    };

    const handleRejectVote = async () => {
        try {
            await DonaThetaArtifactEtherApi.rejectWithdrawalRequest(
                contract,
                projectId,
                withdrawalRequest.requestId
            );
            setVoteCast("Rejected");
            setIsReadyForVoting(true);
        } catch (e) {
            alert("Failed to Reject WithdrawalRequest");
        }
    };

    const VotingDialog = () => (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-gray-700 p-6 rounded-xl max-w-md w-full mx-4">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-white grow text-center text-xl font-bold">Cast Your Vote</h2>
                    <MdCancel
                        className="cursor-pointer text-2xl"
                        onClick={() => {
                            setShowVotingDialog(false);
                        }}
                    />
                </div>

                <p className="my-4 text-center">Choose whether you would wish to approve or reject this withdrawal request. For a withdrawal to occur, the request will require at least 50% of all committee member votes. Ensure you validate the withdrawal request before approving the request.</p>

                <div className="flex pt-2 justify-around space-x-4">
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md disabled:bg-red-800/20 disabled:text-gray-500/50"
                        onClick={() => {
                            handleRejectVote().then(() => setShowVotingDialog(false));
                        }}
                        disabled={!isReadyForVoting}
                    >
                        Reject
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-800 text-white rounded-md disabled:bg-red-800/20 disabled:text-gray-500/50"
                        onClick={() => {
                            handleApprovalVote().then(() => setShowVotingDialog(false));
                        }}
                        disabled={!isReadyForVoting}
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">


            <div className="flex flex-col md:flex-row md:justify-center md:items-center">
                <div className="w-fit rounded-xl border border-blue-900 mx-auto mt-4 p-4">
                    <table className="w-fit divide-y divide-gray-800 text-white">
                        <tbody>
                        <tr>
                            <td className="px-4 py-2 font-bold">Approvals</td>
                            <td className="px-4 py-2">{withdrawalRequest.approvals.length}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-bold">Rejections</td>
                            <td className="px-4 py-2">{withdrawalRequest.rejections.length}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-bold">Total Votes Cast</td>
                            <td className="px-4 py-2">
                                {withdrawalRequest.approvals.length + withdrawalRequest.rejections.length}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {isCommitteeMember && (
                    <div
                        className="h-fit w-fit mx-auto flex flex-col items-center border rounded-xl border-blue-900 my-2 py-3 px-4 space-y-3">
                        <h6 className="font-bold text-lg">{voteCast === null ? "Cast Your Vote" : "Already Voted"}</h6>

                        {voteCast === null ? (
                            <p>Approve or Reject this withdrawal request</p>
                        ) : (
                            <p>`You choose to ${voteCast} the withdrawal request`</p>
                        )}

                        {voteCast === null && (
                            <button
                                className="px-3 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 disabled:bg-gray-800/50 disabled:text-gray-500/50"
                                onClick={() => {
                                    setShowVotingDialog(true)
                                }}
                                disabled={!isReadyForVoting}
                            >
                                Cast Vote
                            </button>
                        )}
                    </div>
                )}


            </div>

            {showVotingDialog && <VotingDialog/>}

            <div className="mt-4">
                <div className="flex flex-row items-center px-2">
                    <h2 className="text-xl mx-auto w-fit font-bold">Media Items</h2>

                    {isOrganizer && (
                        <button
                            onClick={() => {
                                setShowAddMediaItemDialog(true);
                            }}
                            className="px-3 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
                        >
                            Add Media Item
                        </button>
                    )}
                </div>

                {allImageMediaItems.length > 0 && (
                    <div>
                        <h6 className="text-lg w-fit mx-auto font-bold">Images</h6>
                        <MediaItemsOrganizersTable className="" mediaItems={allImageMediaItems}/>
                    </div>
                )}

                {allDocumentMediaItems.length > 0 && (
                    <div>
                        <h6 className="text-lg font-bold w-fit mx-auto">Documents</h6>
                        <MediaItemsOrganizersTable className="" mediaItems={allDocumentMediaItems}/>
                    </div>
                )}

                {allVideoMediaItems.length > 0 && (
                    <div>
                        <h6 className="text-lg font-bold w-fit mx-auto">Videos</h6>
                        <MediaItemsOrganizersTable className="" mediaItems={allVideoMediaItems}/>
                    </div>
                )}

                {allLiveStreamMediaItems.length > 0 && (
                    <div>
                        <h6 className="text-lg font-bold w-fit mx-auto">Live Stream</h6>
                        <MediaItemsOrganizersTable className="" mediaItems={allLiveStreamMediaItems}/>
                    </div>
                )}
            </div>

            {showAddMediaItemDialog && (
                <AddMediaItemDialog
                    fileName={`file_project_${projectId}_request_${withdrawalRequest.requestId}`}
                    onSubmitted={(mediaItemType, mediaItemName, mediaItemDescription, mediaItemUrl) => {
                        addMediaItemUsingUrl(
                            mediaItemType,
                            mediaItemName,
                            mediaItemDescription,
                            mediaItemUrl
                        ).then(() => {
                            setShowAddMediaItemDialog(false)
                            reQueryRequest()
                        });
                    }}
                    onExit={() => {
                        setShowAddMediaItemDialog(false);
                    }}
                />
            )}
        </div>
    );
}
