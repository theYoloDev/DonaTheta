import React, {useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import DonaThetaGeneralInfo from "../components/DonaThetaGeneralInfo";
import TopProjectTableInfo from "../components/tables/TopProjectTableInfo";
import WalletNotConnected from "../components/WalletNotConnected";
import Web3Api from "../scripts/Web3Api";
import PastDonations from "../components/tables/PastDonations";
import DonaThetaArtifactEtherApi from "../scripts/DonaThetaArtifactEtherApi";
import DonaThetaGeneralInformation from "../models/DonaThetaGeneralInformation";

export default function HomePage({
    isUserWalletConnected,
    contract,
    walletAddress,
}) {

    const [donaThetaGeneralInformation, setDonaThetaGeneralInfo] = useState(new DonaThetaGeneralInfo(0, 0, 0, 0));
    const [latestDonationProjects, setLatestDonationProjects] = useState([]);

    const queryForGeneralInfo = async (contract) => {

        let nmbOfDonatedProjects = await DonaThetaArtifactEtherApi.getNumberOfDonationProjects(contract);
        let ttlDonations = await DonaThetaArtifactEtherApi.getTotalDonationsReceived(contract);
        let ttlWithdrawn = await DonaThetaArtifactEtherApi.getTotalDonationsUtilized(contract);
        let ttlTargetAmount = await DonaThetaArtifactEtherApi.getTotalTargetAmount(contract);

        setDonaThetaGeneralInfo(
            new DonaThetaGeneralInformation(
                nmbOfDonatedProjects,
                ttlDonations,
                ttlWithdrawn,
                ttlTargetAmount
            )
        );

        await queryForLatestProjects(contract, nmbOfDonatedProjects);
    }

    useEffect(() => {

        if (isUserWalletConnected) {
            // query for general information
            queryForGeneralInfo(contract, walletAddress).then();
        }
    }, [isUserWalletConnected]);

    const queryForLatestProjects = async (contract, nmbOfDonatedProjects) => {

        // Query for 5 latest projects
        let latestProjects = [];
        if (nmbOfDonatedProjects.length > 5) {
            for (let i = nmbOfDonatedProjects - 5; i < nmbOfDonatedProjects.length; i++) {
                let prt = await DonaThetaArtifactEtherApi.queryDonationProject(contract, i);
                latestProjects.push(prt);
            }
        } else {
            for (let i = 0; i < nmbOfDonatedProjects.length; i++) {
                let prt = await DonaThetaArtifactEtherApi.queryDonationProject(contract, i);
                latestProjects.push(prt);
            }
        }
        console.log("latest projects are" + latestProjects);
        setLatestDonationProjects(latestProjects);
    }

    return (
        <>
            <div id="main" className="grow flex flex-col overflow-y-scroll">
                <div className="w-full">
                    <div
                        className="w-fit max-w-3xl border border-blue-700 mx-auto my-3 rounded-xl flex flex-col items-center px-4 py-2">
                        <h3 className="text-2xl">DonaTheta</h3>
                        <p>A decentralized donation platform specializing in accountability and transparency</p>

                    </div>
                </div>

                <div className="w-full grow flex">
                    {isUserWalletConnected ? (
                        <div className="w-full flex flex-col items-center">
                            <DonaThetaGeneralInfo
                                className="mt-2 mb-5"
                                numberOfDonationProjects={donaThetaGeneralInformation.numberOfDonationProjects}
                                totalAmountDonated={donaThetaGeneralInformation.totalAmountDonated}
                                totalAmountWithdrawn={donaThetaGeneralInformation.totalAmountWithdrawn}
                                totalTargetAmount={donaThetaGeneralInformation.totalTargetAmount}
                            />

                            <div className="w-full flex flex-col items-center my-6">
                                <TopProjectTableInfo
                                    className="w-fit"
                                    topProjects={latestDonationProjects}
                                />
                            </div>
                        </div>
                    ) : (
                        <WalletNotConnected
                            className="grow mx-auto my-auto"
                            browserSupportsWeb3={Web3Api.browserSupportsWeb3()}
                        />
                    )}
                </div>


            </div>
        </>
    )
}
