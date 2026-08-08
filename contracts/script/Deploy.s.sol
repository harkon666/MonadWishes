// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MonadBirthdayNFT.sol";
import "../src/MonadBirthdayVault.sol";

contract DeployMonadWishes is Script {
    function run() external {
        vm.startBroadcast();

        address deployer = msg.sender;

        console.log("Deploying MonadWishes contracts on Monad Testnet (Chain ID 10143)...");
        console.log("Deployer Address:", deployer);

        // 1. Deploy MonadBirthdayNFT
        MonadBirthdayNFT nft = new MonadBirthdayNFT(deployer);
        console.log("MonadBirthdayNFT deployed to:", address(nft));

        // 2. Deploy MonadBirthdayVault
        MonadBirthdayVault vault = new MonadBirthdayVault(address(nft), deployer);
        console.log("MonadBirthdayVault deployed to:", address(vault));

        // 3. Link Vault to NFT contract
        nft.setVaultContract(address(vault));
        console.log("NFT vaultContract set to:", address(vault));

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===");
        console.log("MonadBirthdayNFT:", address(nft));
        console.log("MonadBirthdayVault:", address(vault));
    }
}
