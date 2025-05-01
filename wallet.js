import { ethers } from "ethers";

export async function connectWallet() {
    if (!window.ethereum) {
        alert("No wallet found. Please install Metamask!");
        return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    return {
        provider,
        signer,
        address
    };
}
