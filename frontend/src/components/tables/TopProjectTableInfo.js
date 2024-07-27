import React from "react";

export default function TopProjectTableInfo({
    className,
    topProjects
}) {

    return (
        <div className={`${className}`}>
            <h6 className={"text-center text-xl font-bold mb-2"}>Donation Projects</h6>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="border-b">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Project Name
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Number of Donors
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amount Donated
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Donation Target
                    </th>
                </tr>
                </thead>
                <tbody className="text-gray-200 divide-y divide-gray-600">
                {topProjects.map((project, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {project.projectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {project.donors.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {project.topDonationAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {project.donationTarget}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
