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
                <tr className="grid grid-cols-7 gap-4">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider col-span-1">
                        Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider col-span-2">
                        Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider col-span-1">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider col-span-1">
                        Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider col-span-1">
                        Donation Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider col-span-1">
                    </th>
                </tr>
                </thead>
                <tbody>
                {organizingProjects.map((project, index) => (
                    <tr key={index} className="grid grid-cols-7 gap-1">
                        <td className="px-6 py-4 text-sm text-gray-100 col-span-1 overflow-hidden">
                            {project.projectName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100 col-span-2 line-clamp-3">
                            {project.projectDescription}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100 col-span-1 overflow-hidden">
                            {project.status}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100 col-span-1 overflow-hidden">
                            {project.totalAmountDonated} / {project.donationTarget}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100 col-span-1 overflow-hidden">
                            {new Date(project.startDonationDate * 1000).toLocaleDateString()} - {new Date(project.endDonationDate * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100 col-span-1 overflow-hidden">
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
