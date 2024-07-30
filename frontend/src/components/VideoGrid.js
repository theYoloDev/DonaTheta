import React from "react";

export default function VideoGrid({
    items
                                  }) {


    return (
        <div className="grid grid-cols-3 gap-4">
            {items.map((item, index) => (
                <div key={index} className="relative">
                    <video
                        src={item.mediaItemUrl}
                        className="w-full h-full cursor-pointer"
                        controls
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
