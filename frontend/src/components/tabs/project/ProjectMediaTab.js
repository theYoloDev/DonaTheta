import React, { useState, useEffect } from "react";
import DonaThetaArtifactEtherApi from "../../../scripts/DonaThetaArtifactEtherApi";
import ImageGrid from "../../ImageGrid";
import VideoGrid from "../../VideoGrid";
import DocumentList from "../../DocumentList";
import LiveStreamList from "../../LiveStreamList";

class MediaTab {
    static Image = 0;
    static Document = 1;
    static Video = 2;
    static LiveStream = 3;
}

export default function ProjectMediaTab({
                                            project,
                                            contract,
                                            walletAddress,
                                        }) {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(MediaTab.Image);

    const [imageMediaItems, setImageMediaItems] = useState([]);
    const [videoMediaItems, setVideoMediaItems] = useState([]);
    const [documentMediaItems, setDocumentMediaItems] = useState([]);
    const [liveStreamMediaItems, setLiveStreamMediaItems] = useState([]);

    const queryForMediaItems = async () => {
        try {
            const imageItems = await DonaThetaArtifactEtherApi.queryDonationProjectImageItems(
                contract,
                project.projectId
            );
            const documentItems = await DonaThetaArtifactEtherApi.queryDonationProjectDocumentItems(
                contract,
                project.projectId
            );
            const videoItems = await DonaThetaArtifactEtherApi.queryDonationProjectVideoItems(
                contract,
                project.projectId
            );
            const liveStreamItems = await DonaThetaArtifactEtherApi.queryDonationProjectLiveStreamItems(
                contract,
                project.projectId
            );

            setImageMediaItems(imageItems);
            setVideoMediaItems(videoItems);
            setDocumentMediaItems(documentItems);
            setLiveStreamMediaItems(liveStreamItems);
        } catch (e) {
            alert("Error querying Media Items");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        queryForMediaItems().then();
    }, [contract, project.projectId]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const Tabs = () => {
        return (
            <div className="flex mx-auto text-lg border rounded-xl w-fit border-blue-300/20">
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${activeTab === MediaTab.Image ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(MediaTab.Image)}
                >
                    Image
                </button>
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${activeTab === MediaTab.Document ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(MediaTab.Document)}
                >
                    Document
                </button>
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${activeTab === MediaTab.Video ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(MediaTab.Video)}
                >
                    Video
                </button>
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${activeTab === MediaTab.LiveStream ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(MediaTab.LiveStream)}
                >
                    Live Stream
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col p-4">
            <div className="flex space-x-4 mb-4">
                <Tabs />
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {activeTab === MediaTab.Image && <ImageGrid className="grow" items={imageMediaItems} />}
                    {activeTab === MediaTab.Video && <VideoGrid items={videoMediaItems} />}
                    {activeTab === MediaTab.Document && <DocumentList items={documentMediaItems} />}
                    {activeTab === MediaTab.LiveStream && <LiveStreamList items={liveStreamMediaItems} />}
                </>
            )}
        </div>
    );
}
