import React from 'react';

export default function PastDonations({ className, donationHistory }) {
    return (
        <div className={`${className} overflow-y-scroll`} style={{ maxHeight: '400px' }}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="border-b">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Project ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amount
                    </th>
                </tr>
                </thead>
                <tbody>
                {donationHistory.map((donation, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{donation.projectId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                            {new Date(donation.dateTime * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{donation.amount} TFUEL</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
