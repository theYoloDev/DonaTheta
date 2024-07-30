import { useEffect } from "react";

export default function ImageGrid({
                                      className = "",
                                      items
                                  }) {
    return (
        <div className={`grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 ${className}`}>
            {items.map((item, index) => (
                <div key={index} className="relative">
                    <img
                        src={item.mediaItemUrl}
                        alt={item.mediaItemName}
                        className="w-full h-full max-h-72 object-cover cursor-pointer aspect-square"
                        onClick={() => window.open(item.mediaItemUrl, "_blank")}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white">
                        <h3 className="text-sm">{item.mediaItemName}</h3>
                        <p className="text-xs">{item.mediaItemDescription}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
