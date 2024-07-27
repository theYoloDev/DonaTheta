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

    console.log("Deploy: DonaTheta address:", donaTheta.address);

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();

    console.log("Deploy: Token address:", token.address);
    console.log("Deploy: Contract deployed.")

    // Save the frontend files
    saveFrontendFiles("DonaTheta", donaTheta);
    saveFrontendFiles("Token", token);

    saveContractAddresses([
        {
            "name": "Token",
            "address": token.address
        },
        {
            "name": "DonaTheta",
            "address": donaTheta.address
        }
    ])
}

function saveContractAddresses(tokens) {
    const fs = require("fs");
    const contractsDir = removeLastDirectory(removeLastDirectory(__dirname)) + "/frontend/src/abi";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    let obj = {}

    for (const token of tokens) {
        obj[token.name] = token.address
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify(obj, undefined, 2)
    );
}

function saveFrontendFiles(name, token) {
    const fs = require("fs");
    const contractsDir = removeLastDirectory(removeLastDirectory(__dirname)) + "/frontend/src/abi";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    const DonaThetaArtifact = artifacts.readArtifactSync(name);

    fs.writeFileSync(
        contractsDir + `/${name}.json`,
        JSON.stringify(DonaThetaArtifact, null, 2)
    );

}

function removeLastDirectory(directoryName) {
    // Find the last occurrence of either '/' or '\'
    const lastSlashIndex = Math.max(directoryName.lastIndexOf('/'), directoryName.lastIndexOf('\\'));

    // If there is no slash found, return the original string
    if (lastSlashIndex === -1) {
        return directoryName;
    }

    // Return the substring up to (but not including) the last slash
    return directoryName.substring(0, lastSlashIndex);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
