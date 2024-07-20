import React, {useState} from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function NavBar({
    className,
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
                        <a href="/" className="px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">Home</a>
                        <a href="/projects" className="px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">Projects</a>
                        <a href="/organizers" className="px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">Organizers</a>
                        <a href="/about" className="px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">About Us</a>
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
                                            <div className="truncate">{walletAddress}</div>
                                            <button
                                                onClick={connectToWallet}
                                                className="mt-2 w-full bg-gray-800 text-white py-1 px-2 rounded"
                                            >
                                                Connect Wallet
                                            </button>
                                            <button
                                                onClick={logOut}
                                                className="mt-2 w-full bg-gray-800 text-white py-1 px-2 rounded"
                                            >
                                                Log Out
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={connectToWallet}
                                            className="w-full hover:bg-gray-800 text-white py-1 px-2 rounded-md"
                                        >
                                            Connect Wallet
                                        </button>
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
