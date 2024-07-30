import WalletNotConnected from "../components/WalletNotConnected";
import Web3Api from "../scripts/Web3Api";
import React, {useEffect, useState} from "react";
import {useLoaderData} from "react-router-dom";
import DonaThetaArtifactEtherApi from "../scripts/DonaThetaArtifactEtherApi";
import WithdrawalRequestMediaTab from "../components/tabs/withdrawalRequest/WithdrawalRequestMediaTab";
import WithdrawalRequestOrganizerTab from "../components/tabs/withdrawalRequest/WithdrawalRequestOrganizerTab";
import WithdrawalRequestMainTab from "../components/tabs/withdrawalRequest/WithdrawalRequestMainTab";


class WithdrawalRequestTab {
    static Main = 0;
    static Media = 1;
    static Organizer = 2;
}

export default function WithdrawalRequestPage({
                                                  isUserWalletConnected,
                                                  contract,
                                                  walletAddress
                                              }) {
    const params = useLoaderData();

    const [projectId, setProjectId] = useState(null);
    const [requestId, setRequestId] = useState(null);
    const [withdrawalRequest, setWithdrawalRequest] = useState(null);

    const [isOrganizer, setIsOrganizer] = useState(false);
    const [isCommitteeMember, setIsCommitteeMember] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const [currentTab, setCurrentTab] = useState(WithdrawalRequestTab.Main);

    useEffect(() => {
        setRequestId(params.requestId);
        setProjectId(params.projectId);

        if (isUserWalletConnected) {
            queryWithdrawalRequest(params.projectId, params.requestId).then();
            checkUserRoles(params.projectId).then();
        }
    }, [isUserWalletConnected]);

    const queryWithdrawalRequest = async (projectId, requestId) => {

        // Query for the withdrawal request
        const req = await DonaThetaArtifactEtherApi.queryWithdrawRequest(contract, projectId, requestId);
        setWithdrawalRequest(req);
    }

    const checkUserRoles = async (projectId) => {
        try {
            const organizerStatus = await DonaThetaArtifactEtherApi.checkIfUserIsOrganizer(contract, projectId);
            const committeeMemberStatus = await DonaThetaArtifactEtherApi.checkIfUserIsCommitteeMember(contract, projectId);

            setIsOrganizer(organizerStatus === undefined ? false : organizerStatus);
            setIsCommitteeMember(committeeMemberStatus === undefined ? false : committeeMemberStatus);
        } catch (error) {
            console.error("Error checking user roles:", error);
        }
    };

    const Tabs = () => {
        return (
            <div className="flex mx-auto text-lg border rounded-xl w-fit border-blue-300/20">
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${currentTab === WithdrawalRequestTab.Main ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => setCurrentTab(WithdrawalRequestTab.Main)}
                >
                    Main
                </button>
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${currentTab === WithdrawalRequestTab.Media ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => setCurrentTab(WithdrawalRequestTab.Media)}
                >
                    Media
                </button>
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${currentTab === WithdrawalRequestTab.Organizer ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => setCurrentTab(WithdrawalRequestTab.Organizer)}
                >
                    Organizer
                </button>
            </div>
        );
    };

    const TabContent = () => {
        return (
            <>
                {withdrawalRequest && (
                    <>
                        {currentTab === WithdrawalRequestTab.Main && (
                            <WithdrawalRequestMainTab
                                projectId={projectId}
                                contract={contract}
                                walletAddress={walletAddress}
                                withdrawalRequest={withdrawalRequest}
                            />
                        )}
                        {currentTab === WithdrawalRequestTab.Media && (
                           <>
                               <WithdrawalRequestMediaTab
                                   projectId={projectId}
                                   contract={contract}
                                   walletAddress={walletAddress}
                                   withdrawalRequest={withdrawalRequest}
                               />
                           </>
                        )}
                        {currentTab === WithdrawalRequestTab.Organizer && (
                            <>
                                <WithdrawalRequestOrganizerTab
                                    projectId={projectId}
                                    contract={contract}
                                    walletAddress={walletAddress}
                                    withdrawalRequest={withdrawalRequest}
                                    isOrganizer={isOrganizer}
                                    isCommitteeMember={isCommitteeMember}
                                    reQueryRequest={() => {
                                        queryWithdrawalRequest(params.projectId, params.requestId)
                                            .then();
                                    }}
                                />
                            </>
                        )}
                    </>
                )}
            </>
        )
    }

    return (
        <>
            <div id="main" className="grow flex flex-col">
                {isUserWalletConnected ? (
                    <>
                        {withdrawalRequest !== null ? (
                            <div className="p-2">
                                <div className="flex flex-row justify-around">
                                    <div className="p-3 border rounded-xl border-blue-900 w-fit mx-auto flex flex-col items-center">
                                        <div className="flex flex-row mb-1 space-x-1.5">
                                            <h5 className="font-bold">Name:</h5>
                                            <p>{withdrawalRequest.requestName}</p>
                                        </div>
                                        <div className="flex flex-row mt-1 space-x-1.5">
                                            <h5 className="font-bold">Description: </h5>
                                            <p>{withdrawalRequest.requestDescription}</p>
                                        </div>
                                        <div className="flex flex-row mt-1 space-x-1.5">
                                            <h5 className="font-bold">Amount: </h5>
                                            <p>{`${withdrawalRequest.withdrawalAmount} TFUEL`}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Tabs />
                                    <TabContent />
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-blue-900 mx-auto my-auto px-4 py-2 flex flex-col items-center">
                                <h5 className="text-xl mb-3 font-bold">Loading</h5>
                                <p>The page is currently loading the withdrawal request</p>
                            </div>
                        )}
                    </>
                ) : (
                    <WalletNotConnected
                        className="mx-auto my-auto"
                        browserSupportsWeb3={Web3Api.browserSupportsWeb3()}
                    />
                )}
            </div>
        </>
    )
}
