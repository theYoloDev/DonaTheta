import {useState} from "react";
import DonaThetaArtifactEtherApi from "../../scripts/DonaThetaArtifactEtherApi";
import WithdrawalRequestOrganizerTable from "../tables/WithdrawalRequestOrganizerTable";
import MediaItemsOrganizersTable from "../tables/MediaItemsOrganizersTable";


export default function ProjectOrganizersTab({
                                                 project,
                                                 contract,
                                                 walletAddress,
                                                 isDonaStaff,
                                                 isOrganizer,
                                                 isCommitteeMember
                                             }) {

    const [isLoading, setIsLoading] = useState(false);

    const [showAddMediaItemDialog, setShowAddMediaItemDialog] = useState(false);
    const [showWithdrawalRequestDialog, setShowWithdrawalRequestDialog] = useState(null);
    const [showCreateWithdrawalRequestDialog, setShowCreateWithdrawalRequestDialog] = useState(false);
    const [showApproveRequestDialog, setShowApproveRequestDialog] = useState(null);

    const [finalizedWithdrawalRequests, setFinalizedWithdrawalRequests] = useState([]);
    const [newWithdrawalRequests, setNewWithdrawalRequests] = useState([]);
    const [readyWithdrawalRequests, setReadyWithdrawalRequests] = useState([]);

    const [allImageMediaItems, setAllImageMediaItems] = useState([]);
    const [allDocumentMediaItems, setAllDocumentMediaItems] = useState([]);
    const [allLiveStreamMediaItems, setAllLiveStreamMediaItems] = useState([]);
    const [allVideoMediaItems, setAllVideoMediaItems] = useState([]);
    const [allAudioClipMediaItems, setAllAudioClipMediaItems] = useState([]);

    const queryPageContent = async () => {
        setIsLoading(true);

        await queryWithdrawalRequests();

        await queryMediaItems();

        setIsLoading(false);
    }

    // Function to query media items
    const queryMediaItems = async () => {
        try {
            const images = await DonaThetaArtifactEtherApi.getDonationProjectImageItems(contract, project.projectId);
            const documents = await DonaThetaArtifactEtherApi.getDonationProjectDocumentItems(contract, project.projectId);
            const videos = await DonaThetaArtifactEtherApi.getDonationProjectVideoItems(contract, project.projectId);
            const liveStreams = await DonaThetaArtifactEtherApi.getDonationProjectLiveStreamItems(contract, project.projectId);
            const audioClips = await DonaThetaArtifactEtherApi.getDonationProjectAudioClipItems(contract, project.projectId);

            setAllImageMediaItems(images);
            setAllDocumentMediaItems(documents);
            setAllVideoMediaItems(videos);
            setAllLiveStreamMediaItems(liveStreams);
            setAllAudioClipMediaItems(audioClips);
        } catch (e) {
            console.error("Failed to query media items:", e);
        }
    }

    // Function to query withdrawal requests
    const queryWithdrawalRequests = async () => {
        try {
            const finalized = await DonaThetaArtifactEtherApi.getFinalizedWithdrawalRequests(contract, project.projectId);
            const newRequests = await DonaThetaArtifactEtherApi.getNewWithdrawalRequests(contract, project.projectId);
            const ready = await DonaThetaArtifactEtherApi.getReadyWithdrawalRequests(contract, project.projectId);

            setFinalizedWithdrawalRequests(finalized);
            setNewWithdrawalRequests(newRequests);
            setReadyWithdrawalRequests(ready);
        } catch (e) {
            console.error("Failed to query withdrawal requests:", e);
        }
    }

    const createNewWithdrawalRequest = async (
        requestName,
        requestDescription,
        withdrawalAmount
    ) => {
        try {
            let request = await DonaThetaArtifactEtherApi.createWithdrawalRequest(
                contract,
                project.projectId,
                requestName,
                requestDescription,
                withdrawalAmount
            )
        } catch (e) {
            alert("Error creating new withdrawal request");
        }


    }

    //<editor-fold desc="Media Item Functions">

    const addImageMediaItem = async (
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) => {
        try {
            let request = await DonaThetaArtifactEtherApi.addDonationProjectImageItem(
                contract,
                project.projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl
            )
        } catch (e) {

        }
    }

    const updateImageMediaItems = async (
        requestId,
        mediaItemName,
        mediaItemDescription,
        imageUrl
    ) => {
        try {
            let req = await DonaThetaArtifactEtherApi.editDonationProjectImageItem(
                contract,
                project.projectId,
                mediaItemName,
                mediaItemDescription,
                imageUrl
            )
        } catch (e) {

        }
    }

    const deleteImageMediaItems = async (
        requestId,
        mediaItemIndex
    ) => {
        try {
            let req = await DonaThetaArtifactEtherApi.deleteDonationProjectImageItem(
                contract,
                project.projectId,
                mediaItemIndex
            )
        } catch (e) {

        }
    }

    // Video

    const addVideoMediaItem = async (
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) => {
        try {
            let request = await DonaThetaArtifactEtherApi.addDonationProjectVideoItem(
                contract,
                project.projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl
            )
        } catch (e) {

        }
    }

    const updateVideoMediaItems = async (
        requestId,
        mediaItemName,
        mediaItemDescription,
        imageUrl
    ) => {
        try {
            let req = await DonaThetaArtifactEtherApi.editDonationProjectVideoItem(
                contract,
                project.projectId,
                mediaItemName,
                mediaItemDescription,
                imageUrl
            )
        } catch (e) {

        }
    }

    const deleteVideoMediaItems = async (
        requestId,
        mediaItemIndex
    ) => {
        try {
            let req = await DonaThetaArtifactEtherApi.deleteDonationProjectVideoItem(
                contract,
                project.projectId,
                mediaItemIndex
            )
        } catch (e) {

        }
    }

    // Live Stream

    const addLiveStreamMediaItem = async (
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) => {
        try {
            let request = await DonaThetaArtifactEtherApi.addDonationProjectLiveStreamItem(
                contract,
                project.projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl
            )
        } catch (e) {

        }
    }

    const updateLiveStreamMediaItems = async (
        requestId,
        mediaItemName,
        mediaItemDescription,
        imageUrl
    ) => {
        try {
            let req = await DonaThetaArtifactEtherApi.editDonationProjectLiveStreamItem(
                contract,
                project.projectId,
                mediaItemName,
                mediaItemDescription,
                imageUrl
            )
        } catch (e) {

        }
    }

    const deleteLiveStreamMediaItems = async (
        requestId,
        mediaItemIndex
    ) => {
        try {
            let req = await DonaThetaArtifactEtherApi.deleteDonationProjectLiveStreamItem(
                contract,
                project.projectId,
                mediaItemIndex
            )
        } catch (e) {

        }
    }

    // Audio Clip

    const addAudioClipMediaItem = async (
        requestId,
        mediaItemName,
        mediaItemDescription,
        mediaItemUrl
    ) => {
        try {
            let request = await DonaThetaArtifactEtherApi.addDonationProjectAudioClipItem(
                contract,
                project.projectId,
                mediaItemName,
                mediaItemDescription,
                mediaItemUrl
            )
        } catch (e) {

        }
    }

    const updateAudioClipMediaItems = async (
        requestId,
        mediaItemName,
        mediaItemDescription,
        imageUrl
    ) => {
        try {
            let req = await DonaThetaArtifactEtherApi.editDonationProjectAudioClipItem(
                contract,
                project.projectId,
                mediaItemName,
                mediaItemDescription,
                imageUrl
            )
        } catch (e) {

        }
    }

    const deleteAudioClipMediaItems = async (
        requestId,
        mediaItemIndex
    ) => {
        try {
            let req = await DonaThetaArtifactEtherApi.deleteDonationProjectAudioClipItem(
                contract,
                project.projectId,
                mediaItemIndex
            )
        } catch (e) {

        }
    }

    //</editor-fold>

    //<editor-fold desc="Dialogs">

    const CreateWithdrawalRequestDialog = ({
                                               onSubmit = () => {
                                               },
                                               onExit = () => {
                                               },
                                           }) => {
        const [name, setName] = useState("");
        const [description, setDescription] = useState("");
        const [withdrawalAmount, setWithdrawalAmount] = useState("");

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl text-white mb-4">Create Withdrawal Request</h2>
                    <input
                        type="text"
                        className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <textarea
                        className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Withdrawal Amount (ETH)"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
                            onClick={() =>
                                onSubmit({name, description, withdrawalAmount})
                            }
                        >
                            Submit
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            onClick={onExit}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const WithdrawalRequestDialog = ({
                                         name,
                                         description,
                                         withdrawalAmount,
                                         numberOfApprovals,
                                         numberOfRejections,
                                         owner,
                                         onExit = () => {},
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

    const AddMediaItemDialog = ({
        onSubmit = () => {},
        onExit = () => {}
    }) => {
        const [activeTab, setActiveTab] = useState("url");
        const [mediaType, setMediaType] = useState("");
        const [name, setName] = useState("");
        const [description, setDescription] = useState("");
        const [url, setUrl] = useState("");
        const [file, setFile] = useState(null);

        const handleFileChange = (e) => {
            if (e.target.files.length > 0) {
                setFile(e.target.files[0]);
            }
        };

        const handleSubmit = () => {
            if (activeTab === "url") {
                onSubmit({ mediaType, name, description, url });
            } else {
                onSubmit({ mediaType, name, description, file });
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl text-white mb-4">Add Media Item</h2>
                    <select
                        className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={mediaType}
                        onChange={(e) => setMediaType(e.target.value)}
                    >
                        <option value="">Select Media Type</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                        <option value="document">Document</option>
                        <option value="livestream">Live Stream</option>
                    </select>
                    <input
                        type="text"
                        className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <textarea
                        className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="flex justify-between mb-4">
                        <button
                            className={`w-full py-2 rounded-lg ${activeTab === "url" ? "bg-blue-500" : "bg-gray-500"} text-white`}
                            onClick={() => setActiveTab("url")}
                        >
                            URL
                        </button>
                        <button
                            className={`w-full py-2 rounded-lg ${activeTab === "upload" ? "bg-blue-500" : "bg-gray-500"} text-white`}
                            onClick={() => setActiveTab("upload")}
                        >
                            Upload
                        </button>
                    </div>
                    {activeTab === "url" ? (
                        <input
                            type="text"
                            className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Media URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    ) : (
                        <input
                            type="file"
                            className="w-full mb-4"
                            onChange={handleFileChange}
                        />
                    )}
                    <div className="flex justify-end">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            onClick={onExit}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ApprovalAddressesDialog = ({
                                         title,
                                         addresses = [],
                                         onExit = () => {}
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
        <>
            {newWithdrawalRequests.length > 0 && (
                <div className="">
                    <h6 className="">New Withdrawal Request</h6>
                    <WithdrawalRequestOrganizerTable
                        className=""
                        withdrawalRequests={newWithdrawalRequests}
                        showApprovalButton={true}
                        onApprove={({ requestId }) => {
                            setShowApproveRequestDialog(requestId);
                        }}
                        onView={(requestId) => {
                            setShowWithdrawalRequestDialog(requestId);
                        }}
                    />
                </div>
            )}

            {readyWithdrawalRequests.length > 0 && (
                <div className="">
                    <h6 className="">Ready Withdrawal Request</h6>
                    <WithdrawalRequestOrganizerTable
                        className=""
                        withdrawalRequests={readyWithdrawalRequests}
                        showApprovalButton={true}
                        onApprove={({ requestId }) => {
                            setShowApproveRequestDialog(requestId);
                        }}
                        onView={(requestId) => {
                            setShowWithdrawalRequestDialog(requestId);
                        }}
                    />
                </div>
            )}

            {finalizedWithdrawalRequests.length > 0 && (
                <div className="">
                    <h6 className="">Finalized Withdrawal Request</h6>
                    <WithdrawalRequestOrganizerTable
                        className=""
                        withdrawalRequests={finalizedWithdrawalRequests}
                        showApprovalButton={false}
                        onView={(requestId) => {
                            setShowWithdrawalRequestDialog(requestId);
                        }}
                    />
                </div>
            )}

            <div>
                <h6>Media Items</h6>
            </div>

            {allImageMediaItems.length > 0 && (
                <MediaItemsOrganizersTable
                    className=""
                    mediaItems={allImageMediaItems}
                />
            )}

            {allDocumentMediaItems.length > 0 && (
                <MediaItemsOrganizersTable
                    className=""
                    mediaItems={allDocumentMediaItems}
                />
            )}

            {allVideoMediaItems.length > 0 && (
                <MediaItemsOrganizersTable
                    className=""
                    mediaItems={allVideoMediaItems}
                />
            )}

            {allLiveStreamMediaItems.length > 0 && (
                <MediaItemsOrganizersTable
                    className=""
                    mediaItems={allLiveStreamMediaItems}
                />
            )}

            {allAudioClipMediaItems.length > 0 && (
                <MediaItemsOrganizersTable
                    className=""
                    mediaItems={allAudioClipMediaItems}
                />
            )}

            {showApproveRequestDialog && <></>}

            {showAddMediaItemDialog && (
                <AddMediaItemDialog
                    onSubmit={({ mediaType, name, description, url }) => {
                        // Handle media item submission
                    }}
                    onExit={() => {
                        setShowAddMediaItemDialog(false);
                    }}
                />
            )}

            {showWithdrawalRequestDialog && (
                <WithdrawalRequestDialog
                    name=""
                    description=""
                    withdrawalAmount=""
                    numberOfApprovals={0}
                    numberOfRejections={0}
                    owner=""
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

            {showCreateWithdrawalRequestDialog && (
                <CreateWithdrawalRequestDialog
                    onSubmit={({ name, description, withdrawalAmount }) => {
                        createNewWithdrawalRequest(name, description, withdrawalAmount);
                        setShowCreateWithdrawalRequestDialog(false);
                    }}
                    onExit={() => {
                        setShowCreateWithdrawalRequestDialog(false);
                    }}
                />
            )}

            {isOrganizer && (
                <button
                    className=""
                    onClick={() => setShowCreateWithdrawalRequestDialog(true)}
                >
                    Withdrawal Request
                </button>
            )}
        </>
    );

}
