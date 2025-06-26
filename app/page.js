"use client";

const MAINTENANCE_MODE = false; // <<< BẬT = true / TẮT = false

import { useState, useEffect } from "react";
import { connectWallet } from "../lib/wallet";
import { getStakingInfo, approveToken, stakeToken, unstakeToken } from "../lib/staking";
import toast from "react-hot-toast";

export default function Home() {
    if (MAINTENANCE_MODE) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
                <h1 className="text-5xl font-bold mb-6">🚧 Website Updating 🚧</h1>
                <p className="text-lg">Our miner app is currently being updated. Please check back later.</p>
            </main>
        );
    }

    const [address, setAddress] = useState("");
    const [stakeAmount, setStakeAmount] = useState("");
    const [staked, setStaked] = useState(0);
    const [approved, setApproved] = useState(false);

    const refreshInfo = async () => {
        if (!address) return;
        const info = await getStakingInfo(address);
        setStaked(info.staked);
    };

    const handleConnect = async () => {
        const wallet = await connectWallet();
        if (wallet?.address) {
            setAddress(wallet.address);
            toast.success("Wallet connected!");
        }
    };

    const handleApprove = async () => {
        if (!stakeAmount) return;
        const success = await approveToken(stakeAmount);
        if (success) {
            setApproved(true);
            toast.success("Approval successful. You can now start mining.");
        }
    };

    const handleStake = async () => {
        await stakeToken(stakeAmount);
        toast.success("Mining started!");
        setStakeAmount("");
        setApproved(false);
        refreshInfo();
    };

    const handleUnstake = async () => {
        await unstakeToken();
        toast.success("Unstaked successfully!");
        refreshInfo();
    };

    useEffect(() => {
        if (!address) return;

        refreshInfo();

        const interval = setInterval(() => {
            refreshInfo();
        }, 30000);

        return () => clearInterval(interval);
    }, [address]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-12 space-y-12 bg-gradient-to-br from-black via-gray-900 to-black text-white">
            <div className="flex items-center space-x-4">
                <img src="/images/degenz-logo.png" alt="Degen Z Logo" className="w-12 h-12 rounded-full" />
                <h1 className="text-5xl font-bold text-purple-500">Degen Z Miner App</h1>
            </div>

            <button onClick={handleConnect} className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 shadow-lg">
                {address ? `Connected: ${address}` : "Connect Wallet"}
            </button>

            <div className="space-y-4 mt-10 w-full max-w-2xl">
                <input
                    type="number"
                    placeholder="Enter amount to stake"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="px-4 py-3 rounded-lg text-purple-600 border-2 border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
                />
                <div className="space-x-4">
                    {!approved ? (
                        <button onClick={handleApprove} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 shadow-lg">
                            Approve
                        </button>
                    ) : (
                        <button onClick={handleStake} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 shadow-lg">
                            Start Mining
                        </button>
                    )}
                    <button onClick={handleUnstake} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 shadow-lg">Unstake</button>
                </div>
            </div>

            {/* Total Staked + NODE */}
            <div className="space-y-2 text-lg flex items-center justify-center text-white">
                <p className="flex items-center space-x-2">
                    <span>Total Staked:</span>
                    <span className="text-purple-400">{Math.floor(staked).toLocaleString()} $Z</span>
                    <img src="/images/degenz-logo.png" alt="$Z Logo" className="w-5 h-5 inline-block align-middle ml-1" />
                    <span className="text-gray-400">|</span>
                    <span className="text-green-400">{Math.floor(staked / 1000).toLocaleString()} NODE</span>
                </p>
            </div>

            {/* Buy $Z */}
            <div className="mt-20 w-full max-w-4xl space-y-6">
                <h2 className="text-3xl font-bold mb-2">Buy $Z on DEX</h2>
                <iframe
                    src="https://app.uniswap.org/explore/tokens/base/0xaaae82df66e6113ff9d2e08e2a740f2215b2d60e?inputCurrency=0xaaae82df66e6113ff9d2e08e2a740f2215b2d60e"
                    height="660px"
                    width="100%"
                    style={{ border: "0", borderRadius: "12px" }}
                    title="Swap"
                />
            </div>

            {/* Price Chart */}
            <div className="mt-20 w-full max-w-4xl space-y-6">
                <h2 className="text-3xl font-bold mb-2">Price Chart $Z</h2>
                <iframe
                    src="https://www.geckoterminal.com/base/pools/0xec35ba8f542abe673b16911fca390f24a1c66e53"
                    width="100%"
                    height="600"
                    style={{ border: "0", borderRadius: "12px" }}
                    title="Chart"
                />
            </div>
        </main>
    );
}
