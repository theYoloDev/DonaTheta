import React, { useState, useEffect } from "react";
import Web3Api from "../scripts/Web3Api";
import WalletNotConnected from "../components/WalletNotConnected";
import ProjectWithdrawalTab from "../components/tabs/ProjectWithdrawalTab";
import ProjectOrganizersTab from "../components/tabs/ProjectOrganizersTab";
import ProjectMainTab from "../components/tabs/ProjectMainTab";
import ProjectMediaTab from "../components/tabs/ProjectMediaTab";
import {useLoaderData} from "react-router-dom";

class ProjectTab {
    static MAIN = 0;
    static MEDIA = 1;
    static WITHDRAWAL = 2;
    static ORGANIZERS = 3;
}

export default function ProjectPage({
    isUserWalletConnected,
    contract,
    walletAddress
}) {
    const params = useLoaderData();

    const [projectId, setProjectId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState(ProjectTab.MAIN);
    const [isDonaStaff, setIsDonaStaff] = useState(false);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [isCommitteeMember, setIsCommitteeMember] = useState(false);
    const [project, setProject] = useState(null);

    useEffect(() => {
        console.log("The Project Page: ID is " + params.projectId);
        setProjectId(params.projectId);


        if (isUserWalletConnected) {
            queryProject().then();
            checkUserRoles().then();
        }
    }, [isUserWalletConnected, projectId, walletAddress]);

    const queryProject = async () => {
        setIsLoading(true);
        try {
            const projectData = await Web3Api.getProject(contract, projectId);
            setProject(projectData);
        } catch (error) {
            console.error("Error fetching project data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkUserRoles = async () => {
        try {
            const staffStatus = await Web3Api.isDonaStaff(walletAddress);
            const organizerStatus = await Web3Api.isOrganizer(contract, projectId, walletAddress);
            const committeeMemberStatus = await Web3Api.isCommitteeMember(contract, projectId, walletAddress);

            setIsDonaStaff(staffStatus);
            setIsOrganizer(organizerStatus);
            setIsCommitteeMember(committeeMemberStatus);
        } catch (error) {
            console.error("Error checking user roles:", error);
        }
    };

    const handleTabClick = (tab) => {
        setCurrentTab(tab);
    };

    const Tabs = () => {
        return (
            <div className="flex space-x-4 border-b border-gray-300">
                <button
                    className={`py-2 px-4 ${currentTab === ProjectTab.MAIN ? "font-bold border-b-2 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(ProjectTab.MAIN)}
                >
                    Main
                </button>
                <button
                    className={`py-2 px-4 ${currentTab === ProjectTab.MEDIA ? "font-bold border-b-2 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(ProjectTab.MEDIA)}
                >
                    Media
                </button>
                <button
                    className={`py-2 px-4 ${currentTab === ProjectTab.WITHDRAWAL ? "font-bold border-b-2 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(ProjectTab.WITHDRAWAL)}
                >
                    Withdrawal
                </button>
                <button
                    className={`py-2 px-4 ${currentTab === ProjectTab.ORGANIZERS ? "font-bold border-b-2 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(ProjectTab.ORGANIZERS)}
                >
                    Organizers
                </button>
            </div>
        );
    };

    const TabPage = ({ tab }) => {
        switch (tab) {
            case ProjectTab.MEDIA:
                return (
                    <ProjectMediaTab
                        project={project}
                        contract={contract}
                        walletAddress={walletAddress}
                    />
                );
            case ProjectTab.WITHDRAWAL:
                return (
                    <ProjectWithdrawalTab
                        project={project}
                        contract={contract}
                        walletAddress={walletAddress}
                    />
                );
            case ProjectTab.ORGANIZERS:
                return (
                    <ProjectOrganizersTab
                        project={project}
                        contract={contract}
                        walletAddress={walletAddress}
                        isOrganizer={isOrganizer}
                        isDonaStaff={isDonaStaff}
                    />
                );
            default:
                return (
                    <ProjectMainTab
                        project={project}
                        contract={contract}
                        walletAddress={walletAddress}
                    />
                );
        }
    };

    return (
        <>
            <div id="main" className="flex flex-col grow p-6">
                {isUserWalletConnected ? (
                    <div className="flex flex-col">
                        <div className="flex flex-col md:flex-row items-center mb-4">
                            <div className="border border-blue-900 rounded-xl p-4 flex-1">
                                <h5 className="text-lg font-semibold">Project Information</h5>
                                {project && (
                                    <div>
                                        <p><strong>Project Name:</strong> {project.projectName}</p>
                                        <p><strong>Description:</strong> {project.projectDescription}</p>
                                        {/* Other project details */}
                                    </div>
                                )}
                            </div>
                            <div className="border border-blue-900 rounded-xl p-4 flex-1 ml-4">
                                <h5 className="text-lg font-semibold">Financial Information</h5>
                                {/* Display financial details here */}
                            </div>
                        </div>

                        <Tabs />

                        <div className="mt-4">
                            <TabPage tab={currentTab} />
                        </div>
                    </div>
                ) : (
                    <div className="grow justify-center">
                        <WalletNotConnected
                            className="h-fit mx-auto my-auto"
                            browserSupportsWeb3={Web3Api.browserSupportsWeb3()}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
