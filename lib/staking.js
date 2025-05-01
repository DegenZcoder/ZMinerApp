import { ethers } from "ethers";

const STAKING_CONTRACT_ADDRESS = "0x8d504D51FB5A35876D917f2c84805859CAd503f1";
const Z_TOKEN_ADDRESS = "0xaaAE82DF66E6113Ff9d2E08e2a740F2215b2D60E";

const ABI = [
    "function stake(uint256 amount) public",
    "function unstake() public",
    "function claimReward(uint256 week) public",
    "function getCurrentWeek() public view returns (uint256)",
    "function getClaimable(address user, uint256 week) public view returns (uint256)",
    "function stakes(address user) public view returns (uint256 amount, uint256 startWeek, bool active)"
];

// Get staking + claimable rewards info
export async function getStakingInfo(userAddress) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ABI, provider);

    const currentWeek = await contract.getCurrentWeek();
    const claimable = await contract.getClaimable(userAddress, currentWeek > 0 ? currentWeek - 1 : 0);
    const [amount] = await contract.stakes(userAddress);

    return {
        staked: parseFloat(ethers.formatUnits(amount, 18)),
        reward: parseFloat(ethers.formatUnits(claimable, 18))
    };
}

// Approve Z token
export async function approveToken(amount) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const zToken = new ethers.Contract(Z_TOKEN_ADDRESS, [
        "function approve(address spender, uint256 amount) public returns (bool)"
    ], signer);

    const tx = await zToken.approve(STAKING_CONTRACT_ADDRESS, ethers.parseUnits(amount, 18));
    await tx.wait();

    return true;
}

// Stake Z token
export async function stakeToken(amount) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ABI, signer);

    const tx = await contract.stake(ethers.parseUnits(amount, 18));
    await tx.wait();
}

// Unstake Z token
export async function unstakeToken() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ABI, signer);

    const tx = await contract.unstake();
    await tx.wait();
}

// Claim rewards
export async function claimReward() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ABI, signer);

    const currentWeek = await contract.getCurrentWeek();
    const weekToClaim = currentWeek > 0 ? currentWeek - 1 : 0;

    if (weekToClaim === 0) {
        // Week 0 can't claim
        throw new Error("Claiming is not available in Week 0.");
    }

    const tx = await contract.claimReward(weekToClaim);
    await tx.wait();
}
