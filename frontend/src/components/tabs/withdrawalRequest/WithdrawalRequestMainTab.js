import {useEffect, useState} from "react";
import DonaThetaArtifactEtherApi from "../../../scripts/DonaThetaArtifactEtherApi";
import WithdrawalRequestStatus from "../../../models/WithdrawalRequestStatus";

export default function WithdrawalRequestMainTab({
                                                     projectId,
                                                     withdrawalRequest,
                                                     contract,
                                                     walletAddress
                                                 }) {

    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        checkIsOwner()
    })

    const checkIsOwner = () => {
        setIsOwner(withdrawalRequest.owner === walletAddress);
    }

    const makeWithdrawal = async () => {
        try {
            await DonaThetaArtifactEtherApi.withdrawFunds(contract, projectId, withdrawalRequest.requestId);
            alert("Withdrawal Successful");
        } catch (e) {
            console.log("WithdrawalRequestMainTab: Error withdrawing funds");
            alert("Error withdrawing funds");
        }
    }


    const AddressTable = ({addresses}) => (
        <div className="overflow-x-auto">
            {addresses.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-800 bg-gray-700 text-white">
                    <tbody className="divide-y divide-gray-800">
                    {addresses.map((address, index) => (
                        <tr key={index} className="hover:bg-gray-600">
                            <td className="px-4 py-2">{address}</td>
                            <td className="px-4 py-2">
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                    onClick={() => navigator.clipboard.writeText(address)}
                                >
                                    Copy
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="my-4">
                    <h6 className="w-fit mx-auto text-lg">Empty</h6>
                </div>
            )}
        </div>
    );


    return (
        <div className="space-y-4 py-4">
            {isOwner && withdrawalRequest.withdrawalRequestStatus === WithdrawalRequestStatus.APPROVED_BY_COMMITTEE && (
                <div
                    className="h-fit w-fit mx-auto flex flex-col items-center border rounded-xl border-blue-900 my-2 py-3 px-4 space-y-3">
                    <h6 className="font-bold text-lg">Withdraw Funds</h6>
                    <p className="text-center">
                        Congratulations! Your withdrawal request has been approved. You can
                        now withdraw your funds.
                    </p>
                    <button
                        className="px-3 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
                        onClick={makeWithdrawal}
                    >
                        Withdraw
                    </button>
                </div>
            )}

            <div className="w-fit mx-auto">
                <h6 className="w-fit mx-auto font-bold text-xl">Committee Votes</h6>
                <p className="text-center w-fit mx-auto max-w-md my-4">This is how the committee has voted for this withdrawal request</p>
                <div className="flex flex-col md:flex-row md:space-x-1.5 md:justify-around items-center space-x-4">
                    <div>
                        <h3 className="text-lg font-bold">Approvals</h3>
                        <AddressTable addresses={withdrawalRequest.approvals}/>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold">Rejections</h3>
                        <AddressTable addresses={withdrawalRequest.rejections}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
