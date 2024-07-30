import React, {useState} from 'react';
import PieChart from "./charts/PieChart";

export default function DonaThetaGeneralInfo({
    className,
    numberOfDonationProjects,
    totalAmountDonated,
    totalAmountWithdrawn,
    totalTargetAmount
}) {

    const chartData = {
        labels: ['Total Donations', 'Remaining Target'],
        datasets: [{
            label: 'Donations vs Target',
            data: [totalAmountDonated, totalTargetAmount - totalAmountDonated],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

    return (
        <div className={`${className} flex items-center h-fit`}>
            <div className="w-full flex flex-col items-center">
                <h6 className="text-lg font-bold mb-4">DonaTheta Info</h6>
                <div className="flex flex-row items-center">
                    <table className="table-auto w-full border-collapse">
                        <tbody>
                        <tr className="border-none">
                            <td className="px-4 py-2">Donation Projects:</td>
                            <td className="px-4 py-2">{numberOfDonationProjects}</td>
                        </tr>
                        <tr className="border-none">
                            <td className="px-4 py-2">Total Amount Donated:</td>
                            <td className="px-4 py-2">{totalAmountDonated}</td>
                        </tr>
                        <tr className="border-none">
                            <td className="px-4 py-2">Total Amount Withdrawn:</td>
                            <td className="px-4 py-2">{totalAmountWithdrawn}</td>
                        </tr>
                        </tbody>
                    </table>


                </div>
            </div>
        </div>
    );
}

