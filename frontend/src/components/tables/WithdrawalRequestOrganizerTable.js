
export default function WithdrawalRequestOrganizerTable({
    className = "",
    withdrawalRequests = [],
    showApprovalButton = true,
    onApprove = (requestId) => {},
    onView = (requestId) => {}
}) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full bg-gray-800">
                <thead>
                <tr>
                    <th className="px-4 py-2 text-left text-white">Name</th>
                    <th className="px-4 py-2 text-left text-white">Description</th>
                    <th className="px-4 py-2 text-left text-white">Amount (ETH)</th>
                    <th className="px-4 py-2 text-left text-white">Approvals</th>
                    <th className="px-4 py-2 text-left text-white">Rejections</th>
                    {showApprovalButton && (
                        <th className="px-4 py-2 text-left text-white">Actions</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {withdrawalRequests.map((request, index) => (
                    <tr
                        key={index}
                        className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                        onClick={() => onView(request.id)}
                    >
                        <td className="px-4 py-2 text-white">{request.name}</td>
                        <td className="px-4 py-2 text-white">{request.description}</td>
                        <td className="px-4 py-2 text-white">{request.amount}</td>
                        <td className="px-4 py-2 text-white">{request.numberOfApprovals}</td>
                        <td className="px-4 py-2 text-white">{request.numberOfRejections}</td>
                        {showApprovalButton && (
                            <td className="px-4 py-2 text-white">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onApprove(request.id);
                                    }}
                                >
                                    Approve
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

