import React, {useState, useEffect} from 'react';
import NavBar from "../components/NavBar";
import WalletNotConnected from "../components/WalletNotConnected";
import ProjectOrganizerTable from "../components/tables/ProjectOrganizerTable";
import {BiLeftArrow, BiRightArrow} from "react-icons/bi";

import { ethers } from "ethers";
import DonaThetaArtifactEtherApi from "../scripts/DonaThetaArtifactEtherApi";
import Web3Api from "../scripts/Web3Api";
// const ethers = require("ethers");

const PROJECTS_PER_PAGE = 10;

export default function ProjectsPage({
    isUserWalletConnected,
    contract,
    walletAddress
}) {

    const [hasQueriedForData, setHasQueriedForData] = useState(false);
    const [numberOfProjects, setNumberOfProjects] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageData, setCurrentPageData] = useState([]);

    useEffect( () => {
        if (isUserWalletConnected && !hasQueriedForData) {
            queryForData().then(r => {});
        }
    }, [isUserWalletConnected, hasQueriedForData]);

    const queryForData = async () => {
        await queryNumberOfProjects();
        await queryProjectsForPage(currentPage);
        setHasQueriedForData(true);
    }

    const queryNumberOfProjects = async () => {
        console.log("queryNumberOfProjects is being called");
        const number = await DonaThetaArtifactEtherApi.getNumberOfDonationProjects(contract);
        setNumberOfProjects(number);
    }

    const queryProjectsForPage = async (pageNumber) => {
        console.log("queryProjectsForPage is being called");
        const projects = [];
        const startId = pageNumber * PROJECTS_PER_PAGE;
        const endId = Math.min(startId + PROJECTS_PER_PAGE, numberOfProjects);

        for (let projectId = startId; projectId < endId; projectId++) {
            const project = await DonaThetaArtifactEtherApi.queryDonationProjects(contract, projectId);
            projects.push(project);
        }

        setCurrentPageData(projects);
    }

    const navigateToNextPage = async () => {
        if ((currentPage + 1) * PROJECTS_PER_PAGE < numberOfProjects) {
            setCurrentPage(currentPage + 1);
            await queryProjectsForPage(currentPage + 1);
        }
    }

    const navigateToPreviousPage = async () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            await queryProjectsForPage(currentPage - 1);
        }
    }

    return (
        <>
            {isUserWalletConnected ? (
                <div>
                    {hasQueriedForData ? (
                        <div className="grow">
                            <div className="mb-4">
                                <h5 className="text-xl font-bold">Projects</h5>
                            </div>

                            <ProjectOrganizerTable
                                className=""
                                organizingProjects={currentPageData}
                            />

                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={navigateToPreviousPage}
                                    disabled={currentPage === 0}
                                    className="bg-blue-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    <BiLeftArrow/>
                                </button>

                                <button
                                    disabled={true}
                                    className="bg-blue-800 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    {currentPage}
                                </button>

                                <button
                                    onClick={navigateToNextPage}
                                    disabled={(currentPage + 1) * PROJECTS_PER_PAGE >= numberOfProjects}
                                    className="bg-blue-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    <BiRightArrow/>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full mb-3">
                            <div className="flex flex-col items-center w-fit mx-auto my-3 px-4 py-2 rounded-xl">
                                <h4 className="text-2xl">Query For Data</h4>
                                <p>Do you want to query for projects? (This action may utilize a lot of gas fees)</p>
                                <button
                                    role="button"
                                    onClick={async () => {
                                        await queryForData();
                                    }}
                                    className="bg-blue-900 hover:bg-blue-600 rounded-lg text-white font-bold py-2 px-4"
                                >
                                    Query
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className={"grow flex flex-col"}>
                    <WalletNotConnected
                        className="mx-auto my-auto h-fit"
                        browserSupportsWeb3={Web3Api.browserSupportsWeb3()}
                    />
                </div>
            )}
        </>
    )
}
