import Web3 from "web3";

export default class TokenArtifactWeb3Api {

    static async initializeContract(provider) {
        let web3 = new Web3(window.ethereum);
        return new web3.eth.Contract(
            Token.abi,
            contractAddress.Token
        ).methods.name().call();
    }

    static async getName(contract) {
        try {
            await contract.methods.name.call();
        } catch (error) {
            console.error("Error getting name:", error);
            throw error;
        }
    }

}
