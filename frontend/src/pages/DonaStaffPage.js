import React, { useState, useEffect } from "react";
import DonaThetaArtifactEtherApi from "../scripts/DonaThetaArtifactEtherApi";
import Web3Api from "../scripts/Web3Api";
import WalletNotConnected from "../components/WalletNotConnected";

export default function DonaStaffPage({
      isUserWalletConnected,
      contract,
      walletAddress,
}) {
    const [donaStaff, setDonaStaff] = useState([]);
    const [showAddDonaStaffDialog, setShowAddDonaStaffDialog] = useState(false);
    const [newStaffAddress, setNewStaffAddress] = useState("");

    useEffect(() => {
        if (isUserWalletConnected) {
            queryDonaStaff().then();
        }
    }, [isUserWalletConnected]);

    const queryDonaStaff = async () => {
        try {
            const staff = await DonaThetaArtifactEtherApi.getDonaStaffMembers(contract);

            setDonaStaff(staff);
        } catch (e) {
            console.log("Error fetching Dona staff members:", e);
        }
    };

    const copyToClipboard = async (address) => {
        await navigator.clipboard.writeText(address);
        alert("Address copied to clipboard!");
    };

    const addDonaStaffMember = async () => {
        try {
            if (newStaffAddress.length === 0) {
                alert("Enter an address");
                return;
            }
            const updatedStaff = await DonaThetaArtifactEtherApi.addDonaStaffMember(contract, newStaffAddress);
            setDonaStaff(updatedStaff);
            setShowAddDonaStaffDialog(false);
            setNewStaffAddress(""); // Clear the input field
        } catch (e) {
            console.log("Error adding Dona staff member:", e);
        }
    };

    return (
        <>
            {isUserWalletConnected ? (
                <div className="p-6">
                    <div className="pb-4 flex flex-row items-center justify-between">
                        <h2 className="text-xl grow text-center font-bold mb-4">Dona Staff Members</h2>
                        <button
                            className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg"
                            onClick={() => setShowAddDonaStaffDialog(true)}
                        >
                            Add DonaStaff
                        </button>
                    </div>

                    <table className="min-w-full">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">#</th>
                            <th className="py-2 px-4 border-b">Address</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {donaStaff.map((address, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{index + 1}</td>
                                <td className="py-2 px-4 border-b">{address}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                        onClick={() => copyToClipboard(address)}
                                    >
                                        Copy
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {showAddDonaStaffDialog && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold mb-4">Add New Staff Member</h3>
                                <input
                                    type="text"
                                    className="border p-2 mb-4 w-full rounded-lg bg-transparent"
                                    placeholder="Enter wallet address"
                                    value={newStaffAddress}
                                    onChange={(e) => setNewStaffAddress(e.target.value)}
                                />
                                <div className="flex justify-end">
                                    <button
                                        className="bg-transparent hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-2"
                                        onClick={() => setShowAddDonaStaffDialog(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg"
                                        onClick={addDonaStaffMember}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <WalletNotConnected
                    className="mx-auto my-auto"
                    browserSupportsWeb3={Web3Api.browserSupportsWeb3()}
                />
            )}
        </>
    );
}
