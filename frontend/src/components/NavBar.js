import React, {useState} from 'react';
import { FaUserCircle } from 'react-icons/fa';
import {FaExclamation} from "react-icons/fa6";
import { Link } from 'react-router-dom';
import {BsPatchExclamation, BsPatchExclamationFill} from "react-icons/bs";

export default function NavBar({
    className,
    browserSupportsWeb3,
    browserIsConnectedToTheta,
    isLoggedIn,
    walletAddress,
    connectToWallet,
    logOut
}) {

    const [isShowingAccountMenu, setIsShowingAccountMenu] = useState(false);

    const toggleAccountMenu = () => {
        setIsShowingAccountMenu(!isShowingAccountMenu);
    }

    return (
        <nav className={`${className} bg-gray-900 ps-1 pe-3 py-2`}>
            <div className="mx-2 flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <a href="#">DonaTheta</a>
                </div>
                <div className="flex items-center">
                    <div className="flex space-x-1">
                        <Link to="/" className="px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">Home</Link>
                        <Link to="/projects" className="px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">Projects</Link>
                        <Link to="/organizers" className="px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">Organizers</Link>
                        <Link to="/about" className="px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">About Us</Link>
                    </div>
                    <div className="ms-5 me-2 relative">
                        <FaUserCircle
                            className="text-gray-300 hover:text-white cursor-pointer text-2xl"
                            onClick={toggleAccountMenu}
                        />
                        {isShowingAccountMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-b-xl shadow-lg z-10">
                                <div className="px-4 py-2 text-gray-900">
                                    {isLoggedIn ? (
                                        <>
                                            <div className="truncate text-gray-300 my-1">{walletAddress}</div>
                                            <button
                                                onClick={connectToWallet}
                                                className="mt-2 w-full bg-gray-800 text-white py-1 px-2 rounded"
                                            >
                                                Connect New Wallet
                                            </button>
                                            <button
                                                onClick={logOut}
                                                className="mt-2 w-full bg-gray-800 text-white py-1 px-2 rounded"
                                            >
                                                Log Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {browserSupportsWeb3 ? (
                                                <>
                                                    {browserIsConnectedToTheta ? (
                                                            <>
                                                                <button
                                                                    onClick={connectToWallet}
                                                                    className="w-full hover:bg-gray-800 text-white py-1 px-2 rounded-md"
                                                                >
                                                                    Connect Wallet
                                                                </button>
                                                            </>
                                                        ) :
                                                        <>
                                                            <div
                                                                className="flex text-white items-center mt-1 mb-3 rounded">
                                                                <BsPatchExclamation className="me-2"/>
                                                                <p title="Your browser is not connected to Theta">
                                                                    Not Connected
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => {}}
                                                                className="w-full hover:bg-gray-800 text-gray-600 py-1 px-2 rounded-md border border-gray-600"
                                                            >
                                                                Connect Wallet
                                                            </button>
                                                        </>
                                                    }
                                                </>
                                            ) : (
                                                <div className="">
                                                    <div className="flex text-white items-center mt-1 mb-3 rounded">
                                                        <BsPatchExclamation className="me-2"/>
                                                        <p title="Your browser does not support Web3">
                                                            Not Supported
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => {}}
                                                        className="w-full hover:bg-gray-800 text-gray-600 py-1 px-2 rounded-md border border-gray-600"
                                                    >
                                                        Connect Wallet
                                                    </button>
                                                </div>
                                            )}


                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
