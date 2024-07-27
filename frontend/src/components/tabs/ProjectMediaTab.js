import {useState} from "react";
import DonaThetaArtifactEtherApi from "../../scripts/DonaThetaArtifactEtherApi";

export default function ProjectMediaTab({
    project,
    contract,
    walletAddress
}) {

    const [isLoading, setIsLoading] = useState(true);

    const [imageMediaItems, setImageMediaItems] = useState([]);
    const [videoMediaItems, setVideoMediaItems] = useState([]);
    const [documentMediaItems, setDocumentMediaItems] = useState([]);
    const [liveStreamMediaItems, setLiveStreamMediaItems] = useState([]);

     const queryForMediaItems = async () => {
         const imageItems = DonaThetaArtifactEtherApi.queryDonationProjectImageItems(contract, project.projectId);
     }

    return (
        <>
        </>
    )
}
