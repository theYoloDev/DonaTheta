import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectOrganizerTable({
    className = '',
    organizingProjects
}) {

    return (
        <div className={`${className} overflow-x-auto`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Donation Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">

                    </th>
                </tr>
                </thead>
                <tbody>
                {organizingProjects.map((project, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{project.projectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{project.projectDescription}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{project.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                            {project.totalAmountDonated} / {project.donationTarget}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                            {new Date(project.startDonationDate * 1000).toLocaleDateString()} - {new Date(project.endDonationDate * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                            <Link
                                to={`/project/${project.projectId}`}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Open Project
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
