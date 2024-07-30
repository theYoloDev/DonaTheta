import { useEffect, useState } from "react";
import { TiInfoLarge } from "react-icons/ti";
import DonaThetaArtifactEtherApi from "../../../scripts/DonaThetaArtifactEtherApi";

export default function ProjectMainTab({
                                           project,
                                           contract,
                                           walletAddress,
                                       }) {
    const [amountDonatedForProject, setAmountDonatedForProject] = useState(0);
    const [amountToDonate, setAmountToDonate] = useState(0);

    const queryAmountDonatedForProject = async () => {
        try {
            let amountDonated =
                await DonaThetaArtifactEtherApi.getAmountDonatedToProject(
                    contract,
                    project.projectId
                );
            setAmountDonatedForProject(amountDonated);
        } catch (e) {
            alert("Problem querying for amount donated");
        }
    };

    useEffect(() => {
        queryAmountDonatedForProject().then();
    }, [contract, project.projectId]);

    const makeDonation = async () => {
        if (amountToDonate <= 0) {
            alert("Please enter a valid amount to donate.");
            return;
        }

        try {
            await DonaThetaArtifactEtherApi.makeDonation(
                contract,
                project.projectId,
                DonaThetaArtifactEtherApi.parseEther(amountToDonate)
            );
            alert("Donation Successful");
            setAmountToDonate(0);
            queryAmountDonatedForProject(); // Update the donated amount after a successful donation
        } catch (e) {
            console.log("ProjectMainTab: Donation Failed: " + e);
            alert("There was an error processing your donation");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-2 bg-dark-blue-900 text-white">
            <div className="my-2 p-4 bg-dark-blue-800 rounded-lg shadow-lg">
                <p className="text-center text-base font-medium">
                    Welcome to the donation project page. Your contributions help us
                    support important causes and make a meaningful impact. Each donation
                    brings us closer to achieving our goals. Funds are donated to various
                    projects and are all fully accounted for. Donations are directly
                    received by the organizers, and their utilization is fully monitored
                    by a dedicated committee to ensure transparency and accountability.
                </p>
            </div>
            <div className="my-2 p-4 bg-dark-blue-800 border border-dark-blue-600 rounded-lg shadow-lg">
                <p className="text-center text-sm">
                    In total, you have donated {amountDonatedForProject} TFUEL to this
                    project
                </p>
            </div>

            <form
                className="flex flex-row items-center space-x-4 my-2"
                onSubmit={(e) => e.preventDefault()}
            >
                <input
                    type="number"
                    className="p-2 text-white rounded-lg bg-transparent border border-white text-end disable-number-spinner"
                    placeholder="Enter amount to donate"
                    value={amountToDonate}
                    onChange={(e) => setAmountToDonate(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800 disabled:bg-gray-700/20"
                    onClick={makeDonation}
                    disabled={!project.isApproved}
                >
                    Donate
                </button>
            </form>

            <div className="flex flex-row items-center my-2 p-4 rounded-xl shadow-lg space-x-2">
                <TiInfoLarge className="text-xl text-blue-800" />
                <p className="text-blue-800 text-sm andika-bold">Please note:</p>
                <p className="text-center text-sm">
                    All funds donated are irreversible.
                </p>
            </div>
        </div>
    );
}
