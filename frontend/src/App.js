import styles from './App.css';
import NavBar from "./components/NavBar";
import React, {useEffect, useState} from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ErrorPage from "./pages/ErrorPage";
import OrganizersPage from "./pages/OrganizersPage";
import AboutUsPage from "./pages/AboutUsPage";
import Web3Api from "./scripts/Web3Api";
import DonaThetaGeneralInformation from "./models/DonaThetaGeneralInformation";
import DonaThetaArtifactEtherApi from "./scripts/DonaThetaArtifactEtherApi";
import ProjectPage from "./pages/ProjectPage";
import DonaStaffPage from "./pages/DonaStaffPage";

function App() {

    const [browserSupportsWeb3, setBrowserSupportsWeb3] = useState(false);
    const [browserIsConnectedToTheta, setBrowserIsConnectedToTheta] = useState(false);
    const [isUserWalletConnected, setIsUserWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");

    const [contract, setContract] = useState(null);

    const connectUserWallet = async () => {
        try {
            const address = await Web3Api.connectUserWallet();
            setIsUserWalletConnected(true);
            setWalletAddress(address);

            // Listen to account changes
            Web3Api.listenToWalletChanges(() => {
                disconnectUserWallet();
            })

            let crt = await DonaThetaArtifactEtherApi.initializeContract();
            setContract(crt);

        } catch (error) {
            console.error("Failed to connect wallet", error);
        }
    };

    const disconnectUserWallet = async () => {
        setIsUserWalletConnected(false);
        setWalletAddress("");
    }

    useEffect(() => {
        setBrowserSupportsWeb3(Web3Api.browserSupportsWeb3());
        setBrowserIsConnectedToTheta(Web3Api.checkIfNetworkIsConfigured(true));

        Web3Api.checkIfNetworkIsConfigured(() => {
            setBrowserSupportsWeb3(Web3Api.browserSupportsWeb3());
            setBrowserIsConnectedToTheta(Web3Api.checkIfNetworkIsConfigured(true));
        })
    }, []);

    const MainLayout = () => {

        return (
            <div className="flex flex-col bg-gray-950 text-white h-dvh w-dvh andika-regular">
                <NavBar
                    browserSupportsWeb3={browserSupportsWeb3}
                    isLoggedIn={isUserWalletConnected}
                    browserIsConnectedToTheta={browserIsConnectedToTheta}
                    walletAddress={walletAddress}
                    connectToWallet={connectUserWallet}
                    logOut={disconnectUserWallet}
                />

                <Outlet/>
            </div>
        )
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: <MainLayout/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "/",
                    element: <HomePage
                        isUserWalletConnected={isUserWalletConnected}
                        contract={contract}
                        walletAddress={walletAddress}
                    />
                },
                {
                    path: "/projects",
                    element: <ProjectsPage
                        isUserWalletConnected={isUserWalletConnected}
                        contract={contract}
                        walletAddress={walletAddress}
                    />
                },
                {
                    path: "/organizers",
                    element: <OrganizersPage
                        isUserWalletConnected={isUserWalletConnected}
                        contract={contract}
                        walletAddress={walletAddress}
                    />
                },
                {
                    path: "/about",
                    element: <AboutUsPage/>
                },
                {
                    path: "/donastaff",
                    element: <DonaStaffPage
                                isUserWalletConnected={isUserWalletConnected}
                                contract={contract}
                                walletAddress={walletAddress}
                            />
                },
                {
                    path: `/project/:projectId`,
                    loader: ({params}) => {
                        return params
                    },
                    element: <ProjectPage
                        isUserWalletConnected={isUserWalletConnected}
                        contract={contract}
                        walletAddress={walletAddress}
                    />
                }
            ]
        }
    ])

    return (
        <RouterProvider router={router}/>
    );
}

export default App;
