import { ethers } from "ethers";

export async function connectWallet() {
    if (!window.ethereum) throw new Error("No wallet found");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    const network = await provider.getNetwork();

    // BASE CHAIN ID (Base mainnet là 8453)
    if (network.chainId !== 8453) {
        try {
            await provider.send("wallet_switchEthereumChain", [{ chainId: "0x2105" }]);
        } catch (switchError) {
            if (switchError.code === 4902) {
                // Nếu chưa có Base → thêm Base chain
                await provider.send("wallet_addEthereumChain", [{
                    chainId: "0x2105",
                    chainName: "Base",
                    rpcUrls: ["https://mainnet.base.org"],
                    nativeCurrency: {
                        name: "Base",
                        symbol: "ETH",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://basescan.org"]
                }]);
            } else {
                throw switchError;
            }
        }
    }

    return {
        address: accounts[0]
    };
}
