
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
            <table className="min-w-full bg-gray-800">
                <thead>
                <tr>
                    <th className="px-4 py-2 text-left text-white">Name</th>
                    <th className="px-4 py-2 text-left text-white">Description</th>
                    <th className="px-4 py-2 text-left text-white">Type</th>
                    <th className="px-4 py-2 text-left text-white">URL</th>
                </tr>
                </thead>
                <tbody>
                {mediaItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="px-4 py-2 text-white">{item.name}</td>
                        <td className="px-4 py-2 text-white">{item.description}</td>
                        <td className="px-4 py-2 text-white">{item.type}</td>
                        <td className="px-4 py-2 text-white flex items-center">
                            {shortenUrl(item.url)}
                            <button
                                className="ml-2 text-blue-400 hover:text-blue-600"
                                onClick={() => window.open(item.url, '_blank')}
                                title="Open in new tab"
                            >
                                <i className="fas fa-external-link-alt"></i>
                            </button>
                            <button
                                className="ml-2 text-green-400 hover:text-green-600"
                                onClick={() => handleCopy(item.url)}
                                title="Copy URL"
                            >
                                <i className="fas fa-copy"></i>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
