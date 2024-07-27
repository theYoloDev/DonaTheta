

// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '31337';
const THETA_MAINNET_NETWORK_ID = '361';
const THETA_TESTNET_NETWORK_ID = '365';
const THETA_PRIVATENET_NETWORK_ID = '366';

export default class Web3Api {

    static browserSupportsWeb3() {
        return window.ethereum !== undefined;
    }

    static async connectUserWallet() {

        const [selectedAddress] = await window.ethereum.enable();

        if(!this.checkIfNetworkIsConfigured()) {
            return;
        }

        return selectedAddress;
    }

    static listenToWalletChanges(action) {
        window.ethereum.on('accountsChanged', async () => {
            action();
        })
    }

    static checkIfNetworkIsConfigured(
        isInDebugMode = false,
        throwError = false
    ) {
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            return true;
        }

        if (
            window.ethereum.networkVersion === THETA_MAINNET_NETWORK_ID ||
            window.ethereum.networkVersion === THETA_TESTNET_NETWORK_ID ||
            window.ethereum.networkVersion === THETA_PRIVATENET_NETWORK_ID
        ) {
            return true;
        }

        if (isInDebugMode) {
            console.log(`The browser network is not recognized. The current networkVersion is ${window.ethereum.networkVersion}`)
        }

        if (throwError) {
            throw Error("Web3 Error: The browser's network configuration is not recognized");
        }

        return false;
    }
}
