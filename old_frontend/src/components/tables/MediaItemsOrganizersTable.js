import React from 'react';
import { FaExternalLinkAlt, FaCopy } from 'react-icons/fa';

export default function MediaItemsOrganizersTable({
                                                      className = '',
                                                      mediaItems = []
                                                  }) {

    const shortenUrl = (url) => {
        // Shorten the URL for display
        const maxLength = 30;
        return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
    };

    const handleCopy = (url) => {
        // Copy the URL to the clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('URL copied to clipboard');
        }).catch((err) => {
            console.error('Failed to copy URL:', err);
        });
    };

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full border-collapse mb-4 mt-2">
                <thead>
                <tr className="bg-blue-950/20 grid grid-cols-10">
                    <th className="px-4 py-2 text-left text-white col-span-2">Name</th>
                    <th className="px-4 py-2 text-left text-white col-span-5">Description</th>
                    <th className="px-4 py-2 text-left text-white col-span-3">URL</th>
                </tr>
                </thead>
                <tbody>
                {mediaItems.map((item, index) => (
                    <tr
                        key={index}
                        className="even:bg-gray-800/10 hover:bg-blue-950/10 cursor-pointer grid grid-cols-10"
                    >
                        <td className="col-span-2 px-4 py-2 text-white break-words">{item.mediaItemName}</td>
                        <td className="col-span-5 px-4 py-2 text-white break-words">{item.mediaItemDescription}</td>
                        <td className="col-span-3 px-4 py-2 text-white flex items-center break-words">
                            {shortenUrl(item.mediaItemUrl)}
                            <button
                                className="ml-2 text-blue-800 hover:text-green-600"
                                onClick={() => window.open(item.mediaItemUrl, '_blank')}
                                title="Open in new tab"
                            >
                                <FaExternalLinkAlt />
                            </button>
                            <button
                                className="ml-2 text-blue-800 hover:text-green-600"
                                onClick={() => handleCopy(item.mediaItemUrl)}
                                title="Copy URL"
                            >
                                <FaCopy />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
