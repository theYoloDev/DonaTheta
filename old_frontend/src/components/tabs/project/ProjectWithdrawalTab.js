import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import DonaThetaArtifactEtherApi from "../../../scripts/DonaThetaArtifactEtherApi";

const WITHDRAWAL_REQUESTS_PER_PAGE = 15;

export default function ProjectWithdrawalTab({
                                                 project,
                                                 contract,
                                                 walletAddress,
                                                 isOrganizer,
                                                 showCreateWithdrawalRequestDialog
                                             }) {

    const [totalAmountWithdrawn, setTotalAmountWithdrawn] = useState(0);
    const [totalAmountDonated, setTotalAmountDonated] = useState(0);

    const [allWithdrawalRequests, setAllWithdrawalRequests] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [totalNumberOfPages, setTotalNumberOfPages] = useState(0);

    useEffect(() => {
        queryAllWithdrawalRequests().then(() => {
            setPage(1);
        })
    }, []);

    // Helper function to trim address
    const trimAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    const queryAllWithdrawalRequests = async () => {

        let withdrawalRequests = [];
        let numberOfWithdrawalRequestsInProject = await DonaThetaArtifactEtherApi.getNumberOfWithdrawalRequestsInProject(contract, project.projectId);

        for (let i = 0; i < numberOfWithdrawalRequestsInProject; i++) {
            let withdrawalRequest = await DonaThetaArtifactEtherApi.queryWithdrawRequest(contract, project.projectId, i);
            withdrawalRequests.push(withdrawalRequest);
        }

        setAllWithdrawalRequests(withdrawalRequests);
        setTotalNumberOfPages(Math.ceil(withdrawalRequests.length / WITHDRAWAL_REQUESTS_PER_PAGE));
    }

    const setPage = (page) => {
        if (page < 1 || page > totalNumberOfPages) {
            return;
        }

        const startIndex = WITHDRAWAL_REQUESTS_PER_PAGE * (page - 1);
        const endIndex = (WITHDRAWAL_REQUESTS_PER_PAGE * page);

        setCurrentPageData(allWithdrawalRequests.splice(startIndex, endIndex));
        setCurrentPage(page);

    }

    const handlePreviousPage = () => {
        setPage(Math.max(1, currentPage - 1));
    }

    const handleNextPage = () => {
        setPage(Math.min(currentPage + 1, totalNumberOfPages));
    }

    return (
        <div className="w-full p-4 text-white">
            <div className="flex flex-row items-center">
                <h2 className="text-xl mx-auto w-fit font-bold mb-4">Withdrawal Requests</h2>

                {isOrganizer && project.isApproved && (
                    <button
                        onClick={() => {
                            showCreateWithdrawalRequestDialog()
                        }}
                        className="px-3 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
                    >
                        Create Request
                    </button>
                )}
            </div>

            <table className="w-full border-collapse mb-4 mt-2">
                <thead>
                <tr className="bg-blue-950/20">
                    <th className="p-2">Owner</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Details</th> {/* New header for the link */}
                </tr>
                </thead>
                <tbody>
                {currentPageData.map((request, index) => (
                    <tr
                        key={index}
                        className="even:bg-gray-800/20 hover:bg-blue-950/10 cursor-pointer"
                    >
                        <td className="p-2">{trimAddress(request.owner)}</td>
                        <td className="p-2">{request.requestName}</td>
                        <td className="p-2">{request.requestDescription}</td>
                        <td className="p-2">{request.withdrawalAmount}</td>
                        <td className="p-2">
                            <Link
                                to={`/project/${request.projectId}/withdrawalRequest/${request.requestId}`}
                                className="text-blue-500 hover:underline"
                            >
                                View Details
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center">
                <button
                    className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800 disabled:bg-gray-700/50 disabled:text-gray-300/60"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalNumberOfPages}</span>
                <button
                    className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800 disabled:bg-gray-700/50 disabled:text-gray-300/60"
                    onClick={handleNextPage}
                    disabled={currentPage === totalNumberOfPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
