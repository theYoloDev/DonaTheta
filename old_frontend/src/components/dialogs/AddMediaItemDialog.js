import React, {useState} from "react";
import {FaFileUpload} from "react-icons/fa";
import PinataCloudApi from "../../scripts/PinataCloudApi";
import {MdCancel} from "react-icons/md";
import {FiCopy} from "react-icons/fi"
import HuggingFaceApi from "../../scripts/HuggingFaceApi";
import ThetaVideoApi from "../../scripts/ThetaVideoApi";

function dateSerializer() {
    const date = new Date();

    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}_${hour}${minute}${second}`;
}

export default function AddMediaItemDialog({
                                               fileName = "",
                                               onSubmitted,
                                               onExit,
                                           }) {
    const [uploadType, setUploadType] = useState("url");
    const [mediaItemType, setMediaItemType] = useState("0");
    const [mediaItemName, setMediaItemName] = useState("");
    const [mediaItemDescription, setMediaItemDescription] = useState("");
    const [mediaItemUrl, setMediaItemUrl] = useState("");
    const [file, setFile] = useState(null);

    const [imagePrompt, setImagePrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);

    const [fileUrl, setFileUrl] = useState("");

    const [currentThetaLiveStreams, setCurrentThetaLiveStreams] = useState([]);
    const [thetaLiveStream, setThetaLiveStream] = useState(null);
    const [thetaEdgeIngestors, setThetaEdgeIngestors] = useState([]);
    const [thetaEdgeIngestor, setThetaEdgeIngestor] = useState(null);

    const handleSubmit = () => {
        if (mediaItemType === null) {
            alert("Please select a media type");
            return
        }

        if (mediaItemName === "") {
            alert("Please enter a Media Item Name");
            return
        }

        switch (uploadType) {
            case "url":
                onSubmitted(
                    mediaItemType,
                    mediaItemName,
                    mediaItemDescription,
                    mediaItemUrl
                );
                break;
            case "file":
                onSubmitted(
                    mediaItemType,
                    mediaItemName,
                    mediaItemDescription,
                    fileUrl
                );
                break;
            case "imagegen":
                onSubmitted(
                    mediaItemType,
                    mediaItemName,
                    mediaItemDescription,
                    fileUrl
                )
                break;
            default:
                alert("Media Item type not covered")
                break;
        }
    }

    const changeMediaType = (newType) => {
        setMediaItemType(newType)
        setUploadType("url")
    }

    const handleFileUpload = async (fileName, file) => {
        try {
            let itemTypeName = "";
            switch (mediaItemType) {
                case 0:
                    itemTypeName = "image_";
                    break;
                case 1:
                    itemTypeName = "document_";
                    break;
                case 2:
                    itemTypeName = "video_";
                    break;
                case 3:
                    itemTypeName = "livestream_";
                    break;
                default:
                    itemTypeName = "";
            }

            let mediaName =
                mediaItemName === null || mediaItemName === "" ? "" : `${mediaItemName}_`;

            const dateSerial = dateSerializer();
            const uploadedFileUrl = await PinataCloudApi.submitFile(
                `${fileName}_${mediaItemType}${mediaName}${file.name}`,
                file
            );
            setFileUrl(`https://${uploadedFileUrl}`);
            setUploading(false);
        } catch (e) {
            console.log("AddMediaItemDialog: Failed to upload item: ", e)
            alert("Failed to upload item");
            setUploading(false);
        }
    };

    const queryThetaLiveStreams = async () => {
        try {
            const livestreamResponse = await ThetaVideoApi.listLiveStreams();
            const livestreams = livestreamResponse.streams;
            setCurrentThetaLiveStreams(livestreams);
        } catch (e) {
            console.log("AddMediaItemDialog: queryThetaLiveStreams: Failed to query livestreams: ", e);
            alert("Failed to query livestreams")
        }
    }

    const queryThetaEdgeIngestors = async () => {
        try {
            const ingestorResponse = await ThetaVideoApi.listEdgeIngestors();
            const ingestors = ingestorResponse.ingestors;
            setThetaEdgeIngestors(ingestors);
        } catch (e) {
            alert("Failed to query edge ingestors")
        }
    }

    const handleCreateThetaLiveStreamUrl = async (livestreamName) => {
        try {
            // Check the number of registered livestreams
            const liveStreamsResponse = await ThetaVideoApi.listLiveStreams()
            const numberOfLiveStreams = liveStreamsResponse.total_count

            if (numberOfLiveStreams < 3) {
                const response = await ThetaVideoApi.createNewLiveStream(livestreamName);
                await queryThetaLiveStreams()
            }
        } catch (e) {
            console.log("AddMediaItemDialog: handleCreateLiveStreamUrl: Error creating livestream url: ", e)
            alert("Failed to create livestream url")
        }
    }

    const handleSelectThetaLiveStream = async (liveStream) => {
        setThetaLiveStream(liveStream);
    }

    const handleSelectEdgeIngestor = async (edgeIngestor) => {
        try {
            const selectEdgeIngestor = await ThetaVideoApi.selectEdgeIngestor(edgeIngestor.id, thetaLiveStream.id);
            setThetaEdgeIngestor(edgeIngestor);
        } catch (e) {
            console.log("AddMediaItemDialog: handleSelectThetaLiveStream: Error selecting edge ingestor");
            alert("Failed to select edge ingestor");
        }
    }

    const handleImageGenGenerateClick = async () => {
        setGenerating(true);
        try {
            const response = await HuggingFaceApi.stableDiffusionXl(imagePrompt);
            setGeneratedImage(response);
        } catch (e) {
            console.error("AddMediaItemDialog: handleImageGenGenerateClick: Failed to generate image: ", e);
            alert("Failed to generate image");
        } finally {
            setGenerating(false);
        }
    }


    const handleImageGenUploadClick = async () => {
        if (generatedImage) {
            setUploading(true);
            await handleFileUpload(fileName, generatedImage);
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setFileUrl(null);
        }
    };

    const handleFileUploadButtonClick = () => {
        document.getElementById("fileInput").click();
    };

    const handleUploadButtonClick = () => {
        if (file) {
            setUploading(true);
            handleFileUpload(fileName, file).then();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center py-12 overflow-y-scroll">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 mt-20">
                <h2 className="text-xl text-white mb-4">Add Media Item</h2>
                <select
                    className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={mediaItemType}
                    onChange={(e) => changeMediaType(e.target.value)}
                >
                    <option value="0">Image</option>
                    <option value="2">Video</option>
                    <option value="1">Document</option>
                    <option value="3">Live Stream</option>
                </select>
                <input
                    type="text"
                    className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                    value={mediaItemName}
                    onChange={(e) => setMediaItemName(e.target.value)}
                />
                <textarea
                    className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description"
                    value={mediaItemDescription}
                    onChange={(e) => setMediaItemDescription(e.target.value)}
                />
                <div className="mb-3 flex mx-auto text-lg border rounded-xl w-fit border-blue-300/20">
                    <button
                        className={`py-2 px-4 xl:px-5 rounded-xl ${
                            uploadType === "url" ? "font-bold bg-blue-950 border-blue-500" : ""
                        }`}
                        onClick={() => setUploadType("url")}
                    >
                        URL
                    </button>
                    {mediaItemType !== "3" && (
                        <button
                            className={`py-2 px-4 xl:px-5 rounded-xl ${
                                uploadType === "file" ? "font-bold bg-blue-950 border-blue-500" : ""
                            }`}
                            onClick={() => setUploadType("file")}
                        >
                            File
                        </button>
                    )}
                    {mediaItemType === "0" && (
                        <button
                            className={`py-2 px-4 xl:px-5 rounded-xl ${
                                uploadType === "imagegen" ? "font-bold bg-blue-950 border-blue-500" : ""
                            }`}
                            onClick={() => setUploadType("imagegen")}
                        >
                            AI
                        </button>
                    )}
                    {mediaItemType === "3" && (
                        <button
                            className={`py-2 px-4 xl:px-5 rounded-xl ${
                                uploadType === "livestream" ? "font-bold bg-blue-950 border-blue-500" : ""
                            }`}
                            onClick={() => setUploadType("livestream")}
                        >
                            LiveStream
                        </button>
                    )}
                </div>
                {uploadType === "url" && (
                    <input
                        type="text"
                        className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Media URL"
                        value={mediaItemUrl}
                        onChange={(e) => setMediaItemUrl(e.target.value)}
                    />
                )}
                {uploadType === "file" && (
                    <div className="w-full">
                        <div
                            className="p-4 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center cursor-pointer"
                            onClick={handleFileUploadButtonClick}
                        >
                            <FaFileUpload className="mr-2"/>
                            <span>Upload File</span>
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {file && (
                            <div className="mb-4">
                                <p className="text-white mb-2">Selected File:</p>
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="flex items-center bg-gray-700 p-2 rounded-lg border border-gray-500 flex-grow overflow-hidden">
                                        <span
                                            className="truncate grow"
                                            title={file.name}
                                        >
                                            {file.name}
                                        </span>
                                        <button
                                            className="ml-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-800/50 disabled:text-white/60"
                                            onClick={handleUploadButtonClick}
                                            disabled={
                                                uploading ||
                                                mediaItemType === "" ||
                                                (mediaItemType === "0" && !(
                                                    file.name.toLowerCase().endsWith(".png") ||
                                                    file.name.endsWith(".jpg") ||
                                                    file.name.endsWith(".jpeg") ||
                                                    file.name.endsWith(".webp") ||
                                                    file.name.endsWith(".svg")
                                                )) ||
                                                (mediaItemType === "2" && !(
                                                    file.name.endsWith(".mp4") ||
                                                    file.name.endsWith(".mov") ||
                                                    file.name.endsWith(".mkv") ||
                                                    file.name.endsWith(".avi") ||
                                                    file.name.endsWith(".webm") ||
                                                    file.name.endsWith(".flv") ||
                                                    file.name.endsWith(".ts")
                                                ))
                                            }
                                        >
                                            {uploading ? "Uploading..." : (fileUrl === null ? "Upload" : "Uploaded")}
                                        </button>
                                    </div>
                                    <button
                                        className="text-xl text-white"
                                        onClick={() => {
                                            setFile(null);
                                            setFileUrl(null);
                                        }}
                                        disabled={uploading}
                                    >
                                        <MdCancel/>
                                    </button>
                                </div>
                            </div>
                        )}

                        {fileUrl && (
                            <div className="text-white mb-4">
                                <div>File uploaded successfully:</div>
                                <div className="flex items-center bg-gray-700 p-2 rounded-lg border border-gray-500">
                                    <span className="truncate flex-grow">{fileUrl}</span>
                                    <button
                                        className="ml-2 bg-blue-800 text-white px-2 py-2 rounded-lg hover:bg-blue-600"
                                        onClick={() => navigator.clipboard.writeText(fileUrl)}
                                    >
                                        <FiCopy/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {uploadType === "livestream" && (
                    <div className="w-full">
                        <p className="text-center mt-2 mb-4 font-light text-sm">
                            *We have a limit of three livestreams. Ensure that you use them effectively.
                        </p>

                        {/* Livestreams Section */}
                        {currentThetaLiveStreams.length < 3 && (
                            <button
                                className="p-4 mb-4 rounded-lg bg-blue-800 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                                onClick={() => handleCreateThetaLiveStreamUrl("New Livestream")}
                            >
                                Create Livestream
                            </button>
                        )}

                        {thetaLiveStream === null && (
                            <div className="mb-4">
                                <p className="text-white mb-2">Available Livestreams:</p>
                                <div className="space-y-2">
                                    {currentThetaLiveStreams.map((stream) => (
                                        <div
                                            key={stream.id}
                                            className="flex flex-row items-center bg-gray-700 p-2 rounded-lg border border-gray-500 cursor-pointer"
                                        >
                                            <div className="flex-grow">
                                                <span className="truncate">{stream.name}</span>
                                                <span className="ml-2 text-white">Status: {stream.status}</span>
                                            </div>
                                            <button
                                                className="ml-2 bg-blue-800 text-white px-2 py-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={() => handleSelectThetaLiveStream(stream)}
                                                disabled={stream.status !== "off"}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Selected Livestream Details */}
                        {thetaLiveStream && (
                            <div className="text-white mb-4">
                                <div>Selected Livestream:</div>
                                <div className="flex items-center bg-gray-700 p-2 rounded-lg border border-gray-500">
                                    <span className="truncate flex-grow">{thetaLiveStream.name}</span>
                                    <span className="ml-2 text-white">Status: {thetaLiveStream.status}</span>
                                </div>
                            </div>
                        )}

                        {thetaLiveStream && (
                            <>
                                <p className="text-white mb-2">Available Edge Ingestors:</p>
                                <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '200px' }}>
                                    {thetaEdgeIngestors.map((ingestor) => (
                                        <div
                                            key={ingestor.id}
                                            className="flex flex-row items-center bg-gray-700 p-2 rounded-lg border border-gray-500"
                                        >
                                            <div className="flex-grow">
                                                <span className="truncate">{ingestor.id}</span>
                                                <span className="ml-2 text-white">State: {ingestor.state}</span>
                                            </div>
                                            <button
                                                className="ml-2 bg-blue-800 text-white px-2 py-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={() => handleSelectEdgeIngestor(ingestor)}
                                                disabled={ingestor.state !== "available"}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="mt-2 ms-auto bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={queryThetaEdgeIngestors}
                                >
                                    Load More
                                </button>
                            </>
                        )}

                        {/* Selected Edge Ingestor Details */}
                        {thetaEdgeIngestor && (
                            <div className="text-white mb-4">
                                <div>Selected Edge Ingestor:</div>
                                <div className="flex items-center bg-gray-700 p-2 rounded-lg border border-gray-500">
                                    <span className="truncate flex-grow">{thetaEdgeIngestor.id}</span>
                                    <span className="ml-2 text-white">State: {thetaEdgeIngestor.state}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {uploadType === "imagegen" && (
                    <div className="w-full">

                        <p className="text-center mt-2 mb-4 font-light text-sm">*AI should be used in a safe and
                            responsible manner</p>

                        <textarea
                            className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your prompt here..."
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                        />

                        <button
                            className="px-4 ms-auto py-2 mb-4 rounded-lg bg-blue-800 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                            onClick={handleImageGenGenerateClick}
                            disabled={generating}
                        >
                            {generating ? "Generating..." : "Generate"}
                        </button>

                        {generatedImage && (
                            <div className="mb-4">
                                <p className="text-white mb-2">Generated Image:</p>
                                <div className="flex flex-col items-end space-x-2">
                                    <img
                                        src={URL.createObjectURL(generatedImage)}
                                        alt="Generated Preview"
                                        className="max-w-full rounded-lg border-2 border-blue-700"
                                    />

                                    <button
                                        className="mt-2 ms-auto bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                        onClick={handleImageGenUploadClick}
                                        disabled={uploading}
                                    >
                                        {uploading ? "Uploading..." : "Upload"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {fileUrl && (
                            <div className="text-white mb-4">
                                <div>Image uploaded successfully:</div>
                                <div className="flex items-center bg-gray-700 p-2 rounded-lg border border-gray-500">
                                    <span className="truncate flex-grow">{fileUrl}</span>
                                    <button
                                        className="ml-2 bg-blue-800 text-white px-2 py-2 rounded-lg hover:bg-blue-600"
                                        onClick={() => navigator.clipboard.writeText(fileUrl)}
                                    >
                                        <FiCopy/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                <div className="flex justify-end space-x-2">
                    <button
                        className="text-white px-4 py-2 rounded-lg hover:bg-red-800"
                        onClick={() => onExit()}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-800 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600 disabled:bg-gray-900/50 disabled:text-white/60"
                        onClick={handleSubmit}
                        disabled={
                            uploading ||
                            mediaItemName === "" ||
                            mediaItemType === "" ||
                            (uploadType === "file" && (fileUrl === "" || fileUrl === null)) ||
                            (uploadType === "url" && mediaItemUrl === "")
                        }
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
