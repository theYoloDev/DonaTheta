import {FaExclamationTriangle} from "react-icons/fa";

export default function WalletNotConnected({
    className,
    browserSupportsWeb3
}) {

    return (
        <div className={`${className}`}>
            <div className="flex flex-col items-center w-fit p-5 mx-auto my-auto border border-gray-200 rounded-2xl">
                <FaExclamationTriangle className="mt-2 mb-5 text-4xl" />
                <h6 className="text-xl mt-2 mb-1">
                    {browserSupportsWeb3? "Wallet is Not Connected" : "Browser Does Not Support Web3" }
                </h6>
                <>
                {browserSupportsWeb3 ?
                    <p>Please connect your Web3 Wallet</p> :
                    <p>Install <a href="https://metamask.io">MetaMask</a> in your browser.</p>
                }
                </>
            </div>
        </div>
    )

}
