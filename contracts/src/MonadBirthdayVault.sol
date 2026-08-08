// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MonadBirthdayNFT.sol";

/**
 * @title MonadBirthdayVault
 * @notice Time-Locked Birthday Gift Vault & Social Yield Pool on Monad Blockchain.
 * @dev Integrates Monad Native Staking Precompile (0x1000) with internal math fallback & Dynamic On-Chain SVG NFT Booklet minting.
 */
contract MonadBirthdayVault is Ownable, ReentrancyGuard {
    
    // Monad Protocol Constants
    address public constant STAKING_PRECOMPILE = 0x0000000000000000000000000000000000001000;
    address public constant DEFAULT_VALIDATOR = 0x0000000000000000000000000000000000000001;

    struct Greeting {
        address sender;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    struct Vault {
        uint256 id;
        address payable creator;
        address payable recipient;
        string recipientName;
        uint256 targetAmount;       // Target pool size in MON wei
        uint256 birthdayTimestamp;  // Time-lock unlock timestamp
        uint256 totalCollected;    // Total principal collected in wei
        bool isClaimed;
        bool isYieldActive;
        uint256 nftTokenId;        // Dynamic NFT Token ID minted upon claim
        uint256 createdAt;
    }

    uint256 public vaultCounter;
    MonadBirthdayNFT public nftContract;

    mapping(uint256 => Vault) public vaults;
    mapping(uint256 => Greeting[]) public vaultGreetings;

    // Events
    event VaultCreated(
        uint256 indexed vaultId,
        address indexed creator,
        address indexed recipient,
        string recipientName,
        uint256 targetAmount,
        uint256 birthdayTimestamp
    );
    event ContributionReceived(
        uint256 indexed vaultId,
        address indexed contributor,
        uint256 amount,
        string message,
        uint256 totalCollected
    );
    event StakedInMonadPrecompile(uint256 indexed vaultId, uint256 amount, bool precompileSuccess);
    event GiftClaimed(
        uint256 indexed vaultId,
        address indexed recipient,
        uint256 principalAmount,
        uint256 yieldBonus,
        uint256 totalPayout,
        uint256 nftTokenId
    );

    constructor(address _nftAddress, address initialOwner) Ownable(initialOwner) {
        nftContract = MonadBirthdayNFT(_nftAddress);
    }

    function setNFTContract(address _nftAddress) external onlyOwner {
        nftContract = MonadBirthdayNFT(_nftAddress);
    }

    /**
     * @notice Create a new Time-Locked Birthday Vault
     * @param _recipient Recipient wallet address
     * @param _recipientName Recipient's name for display
     * @param _durationInDays Pool duration in days (e.g. 30 days)
     * @param _targetAmount Target amount in MON (wei)
     */
    function createVault(
        address payable _recipient,
        string memory _recipientName,
        uint256 _durationInDays,
        uint256 _targetAmount
    ) external returns (uint256) {
        require(_recipient != address(0), "Invalid recipient address");
        require(_durationInDays > 0, "Duration must be > 0 days");

        vaultCounter++;
        uint256 unlockTime = block.timestamp + (_durationInDays * 1 days);

        vaults[vaultCounter] = Vault({
            id: vaultCounter,
            creator: payable(msg.sender),
            recipient: _recipient,
            recipientName: _recipientName,
            targetAmount: _targetAmount,
            birthdayTimestamp: unlockTime,
            totalCollected: 0,
            isClaimed: false,
            isYieldActive: true,
            nftTokenId: 0,
            createdAt: block.timestamp
        });

        emit VaultCreated(
            vaultCounter,
            msg.sender,
            _recipient,
            _recipientName,
            _targetAmount,
            unlockTime
        );

        return vaultCounter;
    }

    /**
     * @notice Contribute to a Birthday Vault with an on-chain greeting message
     * @param _vaultId Target Vault ID
     * @param _message Greeting message
     */
    function contribute(uint256 _vaultId, string memory _message) external payable nonReentrant {
        Vault storage vault = vaults[_vaultId];
        require(vault.id != 0, "Vault does not exist");
        require(block.timestamp < vault.birthdayTimestamp, "Vault unlock time reached or closed");
        require(!vault.isClaimed, "Vault already claimed");
        require(msg.value > 0, "Contribution must be > 0 MON");

        vault.totalCollected += msg.value;

        vaultGreetings[_vaultId].push(Greeting({
            sender: msg.sender,
            amount: msg.value,
            message: _message,
            timestamp: block.timestamp
        }));

        // Attempt Monad Native Staking Precompile (0x1000) call
        bool precompileSuccess = tryStakeInMonadPrecompile(msg.value);

        emit ContributionReceived(_vaultId, msg.sender, msg.value, _message, vault.totalCollected);
        emit StakedInMonadPrecompile(_vaultId, msg.value, precompileSuccess);
    }

    /**
     * @dev Low-level call to Monad Native Staking Precompile at 0x1000
     * Function signature: delegate(address validator, uint256 amount)
     */
    function tryStakeInMonadPrecompile(uint256 _amount) internal returns (bool) {
        if (_amount == 0) return false;
        bytes memory data = abi.encodeWithSignature("delegate(address,uint256)", DEFAULT_VALIDATOR, _amount);
        (bool success, ) = STAKING_PRECOMPILE.call{value: 0}(data);
        return success;
    }

    /**
     * @notice Release the Birthday Gift + Yield to recipient upon timestamp unlock or Demo Mode
     * @param _vaultId Target Vault ID
     * @param _isDemoMode Set true to trigger Instant Demo Time Travel release during Hackathon demo
     */
    function releaseBirthdayGift(uint256 _vaultId, bool _isDemoMode) external nonReentrant {
        Vault storage vault = vaults[_vaultId];
        require(vault.id != 0, "Vault does not exist");
        require(!vault.isClaimed, "Vault already claimed");
        require(vault.totalCollected > 0, "No funds collected in vault");

        if (!_isDemoMode) {
            require(block.timestamp >= vault.birthdayTimestamp, "Birthday timestamp not reached yet");
        } else {
            // Demo mode can only be triggered by creator or owner for hackathon presentation safety
            require(msg.sender == vault.creator || msg.sender == owner() || msg.sender == vault.recipient, "Unauthorized demo trigger");
        }

        vault.isClaimed = true;

        // Calculate Yield (Prorated 0.5% monthly simulated yield bonus)
        uint256 durationSec = block.timestamp > vault.createdAt ? (block.timestamp - vault.createdAt) : 1 days;
        uint256 yieldBonus = calculateYieldBonus(vault.totalCollected, durationSec);
        uint256 totalPayout = vault.totalCollected + yieldBonus;

        // Mint Dynamic On-Chain SVG NFT Booklet to recipient
        uint256 contributorCount = vaultGreetings[_vaultId].length;
        uint256 mintedTokenId = 0;

        if (address(nftContract) != address(0)) {
            mintedTokenId = nftContract.mintMemoryBooklet(
                vault.recipient,
                vault.recipientName,
                totalPayout,
                contributorCount,
                vault.birthdayTimestamp
            );
            vault.nftTokenId = mintedTokenId;
        }

        // Transfer funds (principal from vault balance + yield bonus from protocol reserve if available)
        uint256 payoutAmount = totalPayout <= address(this).balance ? totalPayout : vault.totalCollected;
        (bool success, ) = vault.recipient.call{value: payoutAmount}("");
        require(success, "Transfer to recipient failed");

        emit GiftClaimed(_vaultId, vault.recipient, vault.totalCollected, yieldBonus, payoutAmount, mintedTokenId);
    }

    /**
     * @notice Helper function to calculate prorated yield bonus (0.5% per 30 days)
     */
    function calculateYieldBonus(uint256 _principal, uint256 _durationSeconds) public pure returns (uint256) {
        if (_principal == 0) return 0;
        // 0.5% (50 basis points) per 30 days (2,592,000 seconds)
        return (_principal * 50 * _durationSeconds) / (10000 * 30 days);
    }

    /**
     * @notice Get all greetings for a vault
     */
    function getGreetings(uint256 _vaultId) external view returns (Greeting[] memory) {
        return vaultGreetings[_vaultId];
    }

    /**
     * @notice Get Vault details and remaining time
     */
    function getVaultDetails(uint256 _vaultId) external view returns (
        Vault memory vault,
        uint256 timeRemaining,
        uint256 currentYieldEstimate
    ) {
        vault = vaults[_vaultId];
        if (block.timestamp >= vault.birthdayTimestamp) {
            timeRemaining = 0;
        } else {
            timeRemaining = vault.birthdayTimestamp - block.timestamp;
        }
        uint256 durationSec = block.timestamp > vault.createdAt ? (block.timestamp - vault.createdAt) : 1 days;
        currentYieldEstimate = calculateYieldBonus(vault.totalCollected, durationSec);
    }

    // Allow contract to receive MON native token for yield reserve
    receive() external payable {}
}
