import { ethers } from "ethers";

const STAKING_CONTRACT_ADDRESS = "0x8d504D51FB5A35876D917f2c84805859CAd503f1";

const ABI = [
    "function stake(uint256 amount) public",
    "function unstake() public",
    "function claimReward(uint256 week) public",
    "function getCurrentWeek() public view returns (uint256)",
    "function getClaimable(address user, uint256 week) public view returns (uint256)"
];

export async function getStakingInfo(userAddress) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ABI, provider);

    const currentWeek = await contract.getCurrentWeek();
    const claimable = await contract.getClaimable(userAddress, currentWeek);

    // Bạn có thể thêm staked nếu có hàm trong contract (ở đây chưa có => trả claimable thôi)
    return {
        staked: 0, // placeholder, nếu muốn lấy thật cần thêm hàm trong ABI
        reward: ethers.formatUnits(claimable, 18)
    };
}

export async function approveToken(amount) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const zToken = new ethers.Contract("0xaaAE82DF66E6113Ff9d2E08e2a740F2215b2D60E", [
        "function approve(address spender, uint256 amount) public returns (bool)"
    ], signer);

    const tx = await zToken.approve(STAKING_CONTRACT_ADDRESS, ethers.parseUnits(amount, 18));
    await tx.wait();

    return true;
}

export async function stakeToken(amount) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ABI, signer);

    const tx = await contract.stake(ethers.parseUnits(amount, 18));
    await tx.wait();
}

export async function unstakeToken() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ABI, signer);

    const tx = await contract.unstake();
    await tx.wait();
}

export async function claimReward() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ABI, signer);

    const currentWeek = await contract.getCurrentWeek();
    const tx = await contract.claimReward(currentWeek);
    await tx.wait();
}
