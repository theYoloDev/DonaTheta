import React, {useState} from 'react';
import NavBar from "../components/NavBar";

export default function HomePage({
    isUserWalletConnected
}) {

    return (
        <>
            <div id="main" className="grow">
                <div className="w-full">
                    <div className="w-fit max-w-3xl border border-blue-700 mx-auto my-3 rounded-xl flex flex-col items-center px-4 py-2">
                        <h3 className="text-2xl">DonaTheta</h3>
                        <p>A decentralized donation platform specializing in accountability and transparency</p>

                    </div>
                </div>

                <div className="w-full">

                </div>

            </div>
        </>
    )
}
