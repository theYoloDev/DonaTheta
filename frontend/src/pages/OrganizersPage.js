import React, {useState} from "react";
import WalletNotConnected from "../components/WalletNotConnected";
import ProjectOrganizerTable from "../components/tables/ProjectOrganizerTable";
import DonaThetaArtifactEtherApi from "../scripts/DonaThetaArtifactEtherApi";
import Web3Api from "../scripts/Web3Api";

export default function OrganizersPage({
                                           isUserWalletConnected,
                                           contract,
                                           address
                                       }) {

    const [hasQueriedForData, setHasQueriedForData] = useState(false);
    const [organizingProjects, setOrganizingProjects] = useState([]);
    const [committeeProjects, setCommitteeProjects] = useState([]);
    const [isDonaStaff, setIsDonaStaff] = useState(false);
    const [unapprovedProjects, setUnapprovedProjects] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [organizerInput, setOrganizerInput] = useState("");
    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
        donationPeriodType: 0,
        organizers: [],
        donationTarget: "",
        startDonationDate: "",
        endDonationDate: ""
    });

    const queryForData = async () => {
        // Query For Organizing projects
        await queryForOrganizingProjects()

        // Query for committee projects
        await queryForCommitteeProjects();

        let isStaff = await queryIsDonaStaff();

        if (isStaff) {
            await queryUnapprovedProjects();
        }
        setHasQueriedForData(true);
    }

    const queryForOrganizingProjects = async () => {
        try {
            let projectIds = await DonaThetaArtifactEtherApi.queryOrganizingProjects(contract);

            let projects = []
            for (const projectId of projectIds) {
                let project = await DonaThetaArtifactEtherApi.queryDonationProject(contract, projectId);
                projects.push(project);
            }

            setOrganizingProjects(projects);
        } catch (e) {
            alert("Problem querying got organizing projects")
        }
    }

    const queryForCommitteeProjects = async () => {
        try {
            let projectIds = await DonaThetaArtifactEtherApi.queryCommitteeProjects(contract);

            let projects = []
            for (const projectId of projectIds) {
                let project = await DonaThetaArtifactEtherApi.queryDonationProject(contract, projectId);
                projects.push(project);
            }

            setCommitteeProjects(projects);
        } catch (e) {
            alert("Problem querying for committee projects");
        }
    }

    const queryIsDonaStaff = async () => {
        try {
            let isDonaStaff = await DonaThetaArtifactEtherApi.queryIsDonaStaff(contract);
            setIsDonaStaff(isDonaStaff);

            return isDonaStaff;
        } catch (e) {
            alert("Error checking if user is a staff member");
        }
    }

    const queryUnapprovedProjects = async () => {
        try {
            let unapprovedProjectIds = await DonaThetaArtifactEtherApi.getUnapprovedDonationProjectIds(contract);

            let projects = []
            for (const projectId of unapprovedProjectIds) {
                let project = await DonaThetaArtifactEtherApi.queryDonationProject(contract, projectId);
                projects.push(project);
            }

            setUnapprovedProjects(projects);
        } catch (e) {
            alert("Error querying unapproved projects");
        }

    }


    //<editor-fold desc="Form Functions">
    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setNewProject({...newProject, [name]: value});
    }

    const handleAddOrganizer = () => {
        if (organizerInput.trim()) {
            setNewProject((prevProject) => ({
                ...prevProject,
                organizers: [...prevProject.organizers, organizerInput.trim()],
            }));
            setOrganizerInput("");
        }
    };

    const handleRemoveOrganizer = (index) => {
        setNewProject((prevProject) => ({
            ...prevProject,
            organizers: prevProject.organizers.filter((_, i) => i !== index),
        }));
    };

    const handleCreateProject = async () => {
        try {
            const {
                projectName,
                projectDescription,
                donationPeriodType,
                organizers,
                donationTarget,
                startDonationDate,
                endDonationDate
            } = newProject;

            const nonEmptyOrganizers = (organizers === undefined || organizers.length === 0) ? [] : organizers;

            const donationTargetInWei = DonaThetaArtifactEtherApi.parseEther(donationTarget);

            await DonaThetaArtifactEtherApi.createDonationProject(
                contract,
                projectName,
                projectDescription,
                donationPeriodType,
                nonEmptyOrganizers,
                donationTargetInWei,
                new Date(startDonationDate).getTime() / 1000,
                new Date(endDonationDate).getTime() / 1000
            );
            setIsModalOpen(false);
            // Optionally, you can refresh the project list after creation
            await queryForData();
        } catch (e) {
            alert("Error creating project");
        }
    }
    //</editor-fold>

    return (
        <>
            <div id="main" className="grow flex flex-col bg-gray-950">
                {isUserWalletConnected ? (
                    <>
                        <div className="w-full mb-3">
                            <div
                                className="w-fit max-w-3xl mx-auto my-3 rounded-xl flex flex-col items-center px-4 py-2">
                                <h3 className="text-2xl">DonaTheta Organizers</h3>
                                <p>Create, Edit and Keep Track of your Donation Projects</p>
                            </div>
                        </div>



                        {hasQueriedForData ? (
                            <div className="">
                                {organizingProjects.length > 0 && (
                                    <div className="mb-6">
                                        <h5 className="text-center text-xl mt-2 mb-4">Organizing Projects</h5>
                                        <ProjectOrganizerTable
                                            className="w-fit mx-auto"
                                            organizingProjects={organizingProjects}
                                        />
                                    </div>
                                )}

                                {committeeProjects.length > 0 && (
                                    <div className="mt-6 mb-4">
                                        <h5 className="text-center text-xl mt-2 mb-4">Committee Projects</h5>
                                        <ProjectOrganizerTable
                                            className="w-fit mx-auto"
                                            organizingProjects={committeeProjects}
                                        />
                                    </div>
                                )}

                                {isDonaStaff && (
                                    <>
                                        {unapprovedProjects.length > 0 && (
                                            <div className="mt-6 mb-4">
                                                <h5 className="text-center text-xl mt-2 mb-4">Unapproved Projects</h5>
                                                <ProjectOrganizerTable
                                                    className="w-fit mx-auto"
                                                    organizingProjects={unapprovedProjects}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="w-full mb-3">
                                <div className="flex flex-col items-center w-fit mx-auto my-3 px-4 py-2 rounded-xl">
                                    <h4 className="text-2xl">Query For Data</h4>
                                    <p>Do you want to query for projects that you organize? (This action may utilize a
                                        lot of gas fees)</p>
                                    <button
                                        role="button"
                                        onClick={async () => {
                                            await queryForData();
                                        }}
                                        className="bg-blue-900 hover:bg-blue-600 rounded-lg px-4 py-1 my-2"
                                    >
                                        Query
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Floating Action Button */}
                        <button
                            className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-800 text-white rounded-xl p-4 shadow-lg"
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                            title="Create new Donation Project"
                        >
                            Create Project
                        </button>

                        {/* Modal for Creating Donation Project */}
                        {isModalOpen && (
                            <div
                                className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
                                <div className="bg-blue-950 rounded-3xl shadow-xl p-6 w-1/2">
                                    <h2 className="text-2xl text-center w-fit font-bold mx-auto mb-4">Create Donation
                                        Project</h2>
                                    <form>
                                        <div className="mb-4">
                                            <label className="block text-gray-400">Project Name</label>
                                            <input
                                                type="text"
                                                name="projectName"
                                                value={newProject.projectName}
                                                onChange={handleInputChange}
                                                className="mt-1 p-2 w-full border rounded-lg bg-transparent"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-400">Description</label>
                                            <textarea
                                                name="projectDescription"
                                                value={newProject.projectDescription}
                                                onChange={handleInputChange}
                                                className="mt-1 p-2 w-full border rounded-lg bg-transparent"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-400">Donation Period Type</label>
                                            <select
                                                name="donationPeriodType"
                                                value={newProject.donationPeriodType}
                                                onChange={handleInputChange}
                                                className="mt-1 p-2 w-full border rounded-lg bg-transparent"
                                            >
                                                <option value="0">Strict</option>
                                                <option value="1">Open</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-400">Organizers</label>
                                            <div className="flex items-center mb-2">
                                                <input
                                                    type="text"
                                                    name="web3Address"
                                                    value={organizerInput}
                                                    onChange={(e) => setOrganizerInput(e.target.value)}
                                                    className="mt-1 p-2 flex-grow border rounded-lg bg-transparent"
                                                    placeholder="Add new organizer address"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddOrganizer}
                                                    className="bg-blue-600 hover:bg-blue-800 text-white rounded-lg px-4 py-2 ml-2"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <ul>
                                                {newProject.organizers.map((organizer, index) => (
                                                    <li key={index}
                                                        className="flex justify-between items-center bg-gray-800 rounded-lg px-2 py-1 mb-1">
                                                        <span className="text-gray-300">{organizer}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveOrganizer(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-400">Donation Target (TFUEL)</label>
                                            <input
                                                type="text"
                                                name="donationTarget"
                                                value={newProject.donationTarget}
                                                onChange={handleInputChange}
                                                className="mt-1 p-2 w-full border rounded-lg bg-transparent"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-400">Start Donation Date</label>
                                            <input
                                                type="date"
                                                name="startDonationDate"
                                                value={newProject.startDonationDate}
                                                onChange={handleInputChange}
                                                className="mt-1 p-2 w-full border rounded-lg bg-transparent"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-400">End Donation Date</label>
                                            <input
                                                type="date"
                                                name="endDonationDate"
                                                value={newProject.endDonationDate}
                                                onChange={handleInputChange}
                                                className="mt-1 p-2 w-full border rounded-lg bg-transparent"
                                            />
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="bg-transparent border border-gray-300 hover:bg-gray-300/20 text-gray-200 rounded-lg px-4 py-2 mr-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCreateProject}
                                                className="bg-blue-600 hover:bg-blue-800 text-white rounded-lg px-4 py-2"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
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
