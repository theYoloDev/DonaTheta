import React from "react";


export default function DocumentList({
    items
                                      }) {


    return (
        <div className="space-y-4">
            <table className="min-w-full divide-y divide-gray-800 bg-gray-700 text-white">
                <thead>
                <tr className="bg-gray-800">
                    <th className="px-4 py-2 text-left text-xs font-bold">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-bold">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-bold">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                {items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-600">
                        <td className="px-4 py-2">
                            <h3 className="text-sm font-medium">{item.mediaItemName}</h3>
                        </td>
                        <td className="px-4 py-2">
                            <p
                                className="text-xs text-gray-400 truncate overflow-hidden"
                                style={{
                                    WebkitLineClamp: 3,
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {item.mediaItemDescripion}
                            </p>
                        </td>
                        <td className="px-4 py-2 flex space-x-2">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                onClick={() => window.open(item.url, "_blank")}
                            >
                                Open
                            </button>
                            <a
                                href={item.url}
                                download
                                className="px-4 py-2 bg-green-600 text-white rounded-md"
                            >
                                Download
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
