import React from "react";
import { FaExclamationTriangle } from "react-icons/fa"; // Import an icon from react-icons

export default function ErrorPage() {
    return (
        <div id="main" className="grow flex flex-col items-center justify-center min-h-screen">
            <FaExclamationTriangle className="text-red-500 text-6xl my-6" />
            <h1 className="text-3xl font-bold my-2">404 - Page Not Found</h1>
            <p className="text-gray-600 my-1">
                Oops! The page you're looking for doesn't exist.
            </p>
        </div>
    );
}
