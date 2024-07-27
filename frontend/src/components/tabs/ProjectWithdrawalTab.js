import {useState} from "react";
import DonaThetaArtifactEtherApi from "../../scripts/DonaThetaArtifactEtherApi";

const WITHDRAWAL_REQUESTS_PER_PAGE = 15;

export default function ProjectWithdrawalTab({
     project,
     contract,
     walletAddress
}) {

    const [totalAmountWithdrawn, setTotalAmountWithdrawn] = useState(0);
    const [totalAmountDonated, setTotalAmountDonated] = useState(0);

    const [allWithdrawalRequests, setAllWithdrawalRequests] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [totalNumberOfPages, setTotalNumberOfPages] = useState(0);

    const queryTotalAmountWithdrawn = async () => {
        let totalWithdrawal = await DonaThetaArtifactEtherApi.getDonationProjectAmountWithdrawn();
        setTotalAmountWithdrawn(totalWithdrawal);
    }

    const queryAllWithdrawalRequests = async () => {

        let withdrawalRequests = [];
        let numberOfWithdrawalRequestsInProject = await DonaThetaArtifactEtherApi.getNumberOfWithdrawalRequestsInProject(contract, project.projectId);

        for (let i = 0; i < numberOfWithdrawalRequestsInProject - 1; i++) {
            let withdrawalRequest = await DonaThetaArtifactEtherApi.queryWithdrawRequest(contract, project.projectId, i);
            withdrawalRequests.push(withdrawalRequest);
        }

        setAllWithdrawalRequests(withdrawalRequests);
    }

    const setPage = (page) => {
        if (page < 1 || page > totalNumberOfPages) {
            return;
        }

        const startIndex = WITHDRAWAL_REQUESTS_PER_PAGE * (page - 1);
        const endIndex = (WITHDRAWAL_REQUESTS_PER_PAGE * page) - 1;

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
        <div className="w-full p-4 bg-dark-blue-900 text-white">
            <h2 className="text-xl mb-4">Withdrawal Requests</h2>

            <div className="flex flex-row mb-4">
                <div className="border border-blue-900 rounded-xl flex flex-col">
                    <h6>Amount Withdrawn</h6>
                    <h5>{totalAmountWithdrawn}</h5>
                </div>
                <div className="border border-blue-900 rounded-xl flex flex-col">
                    <h6>Amount Donated</h6>
                    <h5>{totalAmountDonated}</h5>
                </div>
            </div>

            <table className="w-full border-collapse mb-4 mt-2">
                <thead>
                <tr className="bg-blue-700">
                    <th className="p-2 border border-blue-800">Owner</th>
                    <th className="p-2 border border-blue-800">Name</th>
                    <th className="p-2 border border-blue-800">Description</th>
                    <th className="p-2 border border-blue-800">Amount</th>
                </tr>
                </thead>
                <tbody>
                {currentPageData.map((request, index) => (
                    <tr
                        key={index}
                        className="odd:bg-dark-blue-800 even:bg-dark-blue-700"
                    >
                        <td className="p-2 border border-blue-800">{request.owner}</td>
                        <td className="p-2 border border-blue-800">{request.name}</td>
                        <td className="p-2 border border-blue-800">{request.description}</td>
                        <td className="p-2 border border-blue-800">{request.withdrawAmount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center">
                <button
                    className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalNumberOfPages}</span>
                <button
                    className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
                    onClick={handleNextPage}
                    disabled={currentPage === totalNumberOfPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
