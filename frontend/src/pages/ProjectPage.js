import React, {useState, useEffect} from "react";
import Web3Api from "../scripts/Web3Api";
import WalletNotConnected from "../components/WalletNotConnected";
import ProjectWithdrawalTab from "../components/tabs/project/ProjectWithdrawalTab";
import ProjectOrganizersTab from "../components/tabs/project/ProjectOrganizersTab";
import ProjectMainTab from "../components/tabs/project/ProjectMainTab";
import ProjectMediaTab from "../components/tabs/project/ProjectMediaTab";
import {useLoaderData} from "react-router-dom";
import DonaThetaArtifactEtherApi from "../scripts/DonaThetaArtifactEtherApi";

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
    const [hasQueriedForData, setHasQueriedForData] = useState(false);
    const [showCreateWithdrawalRequestDialog, setShowCreateWithdrawalRequestDialog] = useState(false);

    const [currentTab, setCurrentTab] = useState(ProjectTab.MAIN);
    const [isDonaStaff, setIsDonaStaff] = useState(false);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [isCommitteeMember, setIsCommitteeMember] = useState(false);
    const [project, setProject] = useState(null);

    useEffect(() => {
        setProjectId(params.projectId);

        if (isUserWalletConnected) {
            queryProject(params.projectId).then();
            checkUserRoles().then();
        }
    }, [isUserWalletConnected, projectId, walletAddress]);

    const queryProject = async (projectId) => {
        setIsLoading(true);
        try {
            const projectData = await DonaThetaArtifactEtherApi.queryDonationProject(contract, projectId);
            setProject(projectData);
        } catch (error) {
            console.error("Error fetching project data:", error);
        } finally {
            setHasQueriedForData(true);
            setIsLoading(false);
        }
    };

    const checkUserRoles = async () => {
        try {
            const staffStatus = await DonaThetaArtifactEtherApi.queryIsDonaStaff(contract);
            const organizerStatus = await DonaThetaArtifactEtherApi.checkIfUserIsOrganizer(contract, projectId);
            const committeeMemberStatus = await DonaThetaArtifactEtherApi.checkIfUserIsCommitteeMember(contract, projectId);

            setIsDonaStaff(staffStatus === undefined ? false : staffStatus);
            setIsOrganizer(organizerStatus === undefined ? false : organizerStatus);
            setIsCommitteeMember(committeeMemberStatus === undefined ? false : committeeMemberStatus);
        } catch (error) {
            console.error("Error checking user roles:", error);
        }
    };

    const handleTabClick = (tab) => {
        setCurrentTab(tab);
    };

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
                DonaThetaArtifactEtherApi.parseEther(withdrawalAmount)
            )
        } catch (e) {
            alert("Error creating new withdrawal request");
        }
    }

    const CreateWithdrawalRequestDialog = ({
                                               onSubmit = (requestName, requestDescription, withdrawalAmount) => {},
                                               onExit = () => {},
                                           }) => {
        const [name, setName] = useState("");
        const [description, setDescription] = useState("");
        const [withdrawalAmount, setWithdrawalAmount] = useState("");

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
                <div className="bg-blue-950 rounded-3xl shadow-xl p-6 w-1/2">
                    <h6 className="text-xl text-center w-fit font-bold mx-auto mb-4">
                        Create Withdrawal Request
                    </h6>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            id="requestName"
                            type="text"
                            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="requestDescription"
                            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="withdrawalAmount">
                            Withdrawal Amount (TFUEL)
                        </label>
                        <input
                            id="withdrawalAmount"
                            type="number"
                            className="w-full p-2 rounded-lg bg-gray-700 text-white text-end focus:outline-none focus:ring-2 focus:ring-blue-500 disable-number-spinner"
                            placeholder="TFUEL"
                            value={withdrawalAmount}
                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            className="text-white px-4 py-2 rounded-lg hover:bg-red-800"
                            onClick={onExit}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
                            onClick={() => onSubmit(name, description, withdrawalAmount)}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    const Tabs = () => {
        return (
            <div className="flex mx-auto text-lg border rounded-xl w-fit border-blue-300/20">
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${currentTab === ProjectTab.MAIN ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(ProjectTab.MAIN)}
                >
                    Main
                </button>
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${currentTab === ProjectTab.MEDIA ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(ProjectTab.MEDIA)}
                >
                    Media
                </button>
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${currentTab === ProjectTab.WITHDRAWAL ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(ProjectTab.WITHDRAWAL)}
                >
                    Withdrawal
                </button>
                <button
                    className={`py-2 px-4 xl:px-5 rounded-xl ${currentTab === ProjectTab.ORGANIZERS ? "font-bold bg-blue-950 border-blue-500" : ""}`}
                    onClick={() => handleTabClick(ProjectTab.ORGANIZERS)}
                >
                    Organizers
                </button>
            </div>
        );
    };

    const TabPage = ({tab}) => {
        switch (tab) {
            case ProjectTab.MEDIA:
                return (
                    <>
                        <ProjectMediaTab
                            project={project}
                            contract={contract}
                            walletAddress={walletAddress}
                        />
                    </>

                );
            case ProjectTab.WITHDRAWAL:
                return (
                    <>
                        <ProjectWithdrawalTab
                            project={project}
                            contract={contract}
                            walletAddress={walletAddress}
                            isOrganizer={isOrganizer}
                            showCreateWithdrawalRequestDialog={() => {
                                setShowCreateWithdrawalRequestDialog(true);
                            }}
                        />
                    </>
                );
            case ProjectTab.ORGANIZERS:
                return (
                    <>
                        {/*<ProjectOrganizersTab*/}
                        {/*    project={project}*/}
                        {/*    contract={contract}*/}
                        {/*    walletAddress={walletAddress}*/}
                        {/*    isOrganizer={isOrganizer}*/}
                        {/*    isDonaStaff={isDonaStaff}*/}
                        {/*    showCreateWithdrawalRequestDialog={() => {*/}
                        {/*        setShowCreateWithdrawalRequestDialog(true);*/}
                        {/*    }}*/}
                        {/*    reQueryProject={() => queryProject(projectId)}*/}
                        {/*/>*/}
                    </>
                );
            default:
                return (
                    <>
                        <ProjectMainTab
                            project={project}
                            contract={contract}
                            walletAddress={walletAddress}
                        />
                    </>

                );
        }
    };

    return (
        <>
        <div id="main" className="flex flex-col grow p-6 bg-gray-950">
            {isUserWalletConnected ? (
                <>
                <div className="flex flex-col">
                    {hasQueriedForData && (
                        <>
                            <div className="flex flex-col md:flex-row items-center mb-4">
                                <div className="border border-blue-900 rounded-xl p-4 flex-1">
                                    <h5 className="text-lg font-semibold my-2">Project Information</h5>
                                    {project && (
                                        <div>
                                            <p><strong>Project Name:</strong> {project.projectName}</p>
                                            <p><strong>Description:</strong> {project.projectDescription}</p>
                                            {/* Other project details */}
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="border border-blue-900 rounded-xl p-4 hidden lg:flex lg:flex-col items-center ml-4">
                                    <h5 className="text-lg font-semibold my-2">Financial Information</h5>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <tbody>
                                        <tr>
                                            <td className="px-3 py-1 whitespace-nowrap text-sm font-medium">
                                                Number of Donors:
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                {project.numberOfDonors}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-1 whitespace-nowrap text-sm font-medium">
                                                Donation Target:
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                {project.donationTarget}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-1 whitespace-nowrap text-sm font-medium">
                                                Total Amount Donated:
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                {project.totalAmountDonated}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-1 whitespace-nowrap text-sm font-medium">
                                                Total Amount Withdrawn:
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                {project.totalAmountWithdrawn}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <Tabs/>

                            <div className="mt-4">
                                {(
                                    <>
                                        <TabPage tab={currentTab}/>
                                    </>
                                )}
                            </div>

                            {showCreateWithdrawalRequestDialog && (
                                <CreateWithdrawalRequestDialog
                                onSubmit={(requestName, requestDescription, withdrawalAmount) => {
                                    createNewWithdrawalRequest(requestName, requestDescription, withdrawalAmount).then(r => {
                                        setShowCreateWithdrawalRequestDialog(false)
                                        queryProject(projectId).then();
                                    });
                                }}
                                onExit={() => {
                                    setShowCreateWithdrawalRequestDialog(false)
                                }}
                                />
                            )}
                </>
                )}
                </div>
                </>

                ) : (
                <div className="grow justify-center">
                <WalletNotConnected
                className="h-fit mx-auto my-auto"
                browserSupportsWeb3={Web3Api.browserSupportsWeb3()}
        />
        </div>
    )
}
</div>
</>
)
    ;
}
