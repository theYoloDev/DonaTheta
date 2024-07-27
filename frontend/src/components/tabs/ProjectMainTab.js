import { useEffect, useState } from "react";
import DonaThetaArtifactEtherApi from "../../scripts/DonaThetaArtifactEtherApi";

export default function ProjectMainTab({
       project, contract, walletAddress
}) {
    const [amountDonatedForProject, setAmountDonatedForProject] = useState(0);
    const [amountToDonate, setAmountToDonate] = useState(0);

    const queryAmountDonatedForProject = async () => {
        try {
            let amountDonated = await DonaThetaArtifactEtherApi.getAmountDonatedToProject(
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
                amountToDonate
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
        <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-dark-blue-900 text-white">
            <div className="mb-6 p-4 bg-dark-blue-800 border border-dark-blue-600 rounded-lg shadow-lg">
                <p className="text-center text-base font-medium">
                    Welcome to the donation project page. Your contributions help us
                    support important causes and make a meaningful impact. Each donation
                    brings us closer to achieving our goals.
                </p>
            </div>
            <div className="mb-4 p-4 bg-dark-blue-800 border border-dark-blue-600 rounded-lg shadow-lg">
                <p className="text-center text-sm">
                    Please note: All funds donated are irreversible.
                </p>
            </div>
            <form
                className="flex flex-col items-center space-y-4"
                onSubmit={(e) => e.preventDefault()}
            >
                <input
                    type="number"
                    className="p-2 text-black rounded-md"
                    placeholder="Enter amount to donate"
                    value={amountToDonate}
                    onChange={(e) => setAmountToDonate(e.target.value)}
                />
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800"
                    onClick={makeDonation}
                >
                    Donate
                </button>
            </form>
            <div className="mt-4 p-4 bg-dark-blue-800 border border-dark-blue-600 rounded-lg shadow-lg">
                <p className="text-center text-sm">
                    Total amount donated so far: {amountDonatedForProject} ETH
                </p>
            </div>
        </div>
    );
}
