// This script is used to deploy the contract
async function main() {
    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    // Ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploy: Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    console.log("Deploy: Account balance:", (await deployer.getBalance()).toString());

    const DonaTheta = await ethers.getContractFactory("DonaTheta");
    const donaTheta = await DonaTheta.deploy();
    await donaTheta.deployed();

    console.log("Deploy: Token address:", donaTheta.address);
    console.log("Deploy: Contract deployed.")

    // Save the frontend files
    saveFrontendFiles(donaTheta);
}

function saveFrontendFiles(token) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/src/abi";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({ Token: token.address }, undefined, 2)
    );

    const DonaThetaArtifact = artifacts.readArtifactSync("DonaTheta");

    fs.writeFileSync(
        contractsDir + "/DonaTheta.json",
        JSON.stringify(DonaThetaArtifact, null, 2)
    );

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
