import './App.css';
import NavBar from "./components/NavBar";
import React, {useState} from "react";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ErrorPage from "./pages/ErrorPage";
import OrganizersPage from "./pages/OrganizersPage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {

    const [isUserWalletConnected, setIsUserWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");

    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage />,
            errorElement: <ErrorPage />
        },
        {
            path: "/projects",
            element: <ProjectsPage />
        },
        {
            path: "/organizers",
            element: <OrganizersPage />
        },
        {
            path: "/about",
            element: <AboutUsPage />
        }
    ])

    return (
        <div className="flex flex-col bg-gray-950 text-white h-dvh w-dvh andika-regular">
            <NavBar
                isLoggedIn={isUserWalletConnected}
                walletAddress={walletAddress}

            />

            <RouterProvider router={router} />
        </div>
    );
}

export default App;
