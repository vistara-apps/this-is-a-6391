/**
 * Smart Contract Deployment Script for ShmooPoints
 * 
 * This script can be used to deploy the ShmooPoints contract to Ethereum mainnet
 * using tools like Hardhat, Foundry, or Remix.
 * 
 * Prerequisites:
 * 1. Install Hardhat: npm install --save-dev hardhat
 * 2. Configure hardhat.config.js with your network settings
 * 3. Set up your private key and Alchemy API key in environment variables
 * 
 * Usage:
 * npx hardhat run scripts/deploy.js --network mainnet
 */

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ShmooPoints contract...");

  // Get the contract factory
  const ShmooPoints = await hre.ethers.getContractFactory("ShmooPoints");

  // Deploy the contract
  const shmooPoints = await ShmooPoints.deploy();

  // Wait for deployment to complete
  await shmooPoints.deployed();

  console.log("✅ ShmooPoints deployed to:", shmooPoints.address);
  console.log("📝 Transaction hash:", shmooPoints.deployTransaction.hash);

  // Verify the contract on Etherscan (optional)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await shmooPoints.deployTransaction.wait(6);

    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: shmooPoints.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Error verifying contract:", error.message);
    }
  }

  // Output environment variable for frontend
  console.log("\n📋 Add this to your .env file:");
  console.log(`VITE_SHMOO_CONTRACT_ADDRESS=${shmooPoints.address}`);

  // Test the contract
  console.log("\n🧪 Testing contract functionality...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Get initial contract info
  const initialInfo = await shmooPoints.getContractInfo();
  console.log("Initial total points:", initialInfo.totalPoints.toString());
  console.log("Initial current ID:", initialInfo.currentId.toString());

  // Generate a test Shmoo point
  console.log("Generating test Shmoo point...");
  const tx = await shmooPoints.generateShmooPoint();
  await tx.wait();

  // Get updated contract info
  const updatedInfo = await shmooPoints.getContractInfo();
  console.log("Updated total points:", updatedInfo.totalPoints.toString());
  console.log("Updated current ID:", updatedInfo.currentId.toString());

  // Get user points
  const userPoints = await shmooPoints.getUserPoints(deployer.address);
  console.log("Deployer's points:", userPoints.toString());

  console.log("\n🎉 Deployment and testing completed successfully!");
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
