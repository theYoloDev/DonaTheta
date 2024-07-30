import contractAddress from "../abi/contract-address.json";
import Token from "../abi/Token.json";

import { ethers } from "ethers";
// const { ethers } =  require("ethers");

export default class TokenArtifactEthersApi {

    static async getProvider() {
        return new ethers.providers.Web3Provider(window.ethereum);
    }

    static async initializeContract() {

        let provider = await this.getProvider();

        return new ethers.Contract(
            contractAddress.Token,
            Token.abi,
            provider.getSigner(0)
        );
    }

    static async getName(contract) {
        try {
            let name = await contract.name();
            return name;
        } catch (error) {
            console.error("Error getting name:", error);
            throw error;
        }
    }


}
