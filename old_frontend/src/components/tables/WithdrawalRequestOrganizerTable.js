import React from 'react';
import { Link } from 'react-router-dom';

export default function WithdrawalRequestOrganizerTable({
                                                            className = "",
                                                            withdrawalRequests = [],
                                                        }) {
    // Helper function to trim address
    const trimAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full border-collapse mb-4 mt-2">
                <thead>
                <tr className="bg-blue-950/20">
                    <th className="p-2 text-left text-white">Owner</th>
                    <th className="p-2 text-left text-white">Name</th>
                    <th className="p-2 text-left text-white">Description</th>
                    <th className="p-2 text-left text-white">Amount (ETH)</th>
                    <th className="p-2 text-left text-white">Actions</th>
                </tr>
                </thead>
                <tbody>
                {withdrawalRequests.map((request, index) => (
                    <tr
                        key={index}
                        className="even:bg-gray-800/20 hover:bg-blue-950/10 cursor-pointer"
                    >
                        <td className="p-2 text-white">
                            {trimAddress(request.owner)}
                        </td>
                        <td className="p-2 text-white">
                            {request.requestName}
                        </td>
                        <td className="p-2 text-white">
                            {request.requestDescription}
                        </td>
                        <td className="p-2 text-white">
                            {request.withdrawalAmount}
                        </td>
                        <td className="p-2 text-white">
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
        </div>
    );
}
