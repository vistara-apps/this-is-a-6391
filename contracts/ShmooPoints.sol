// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ShmooPoints
 * @dev A simple contract for generating non-transferable Shmoo points
 * @notice WARNING: Shmoo points are non-transferable and have no value
 */
contract ShmooPoints {
    // Event emitted when a Shmoo point is generated
    event ShmooPointGenerated(
        address indexed user,
        uint256 indexed pointId,
        uint256 timestamp,
        uint256 totalPoints
    );

    // Mapping to track user's total Shmoo points
    mapping(address => uint256) public userPoints;
    
    // Mapping to track if a specific point ID exists
    mapping(uint256 => bool) public pointExists;
    
    // Total number of Shmoo points generated across all users
    uint256 public totalShmooPoints;
    
    // Counter for generating unique point IDs
    uint256 private pointIdCounter;

    /**
     * @dev Generate a new Shmoo point for the caller
     * @notice This function creates a non-transferable point with no monetary value
     */
    function generateShmooPoint() external {
        // Increment counters
        pointIdCounter++;
        totalShmooPoints++;
        userPoints[msg.sender]++;
        
        // Mark this point as existing
        pointExists[pointIdCounter] = true;
        
        // Emit event for tracking
        emit ShmooPointGenerated(
            msg.sender,
            pointIdCounter,
            block.timestamp,
            userPoints[msg.sender]
        );
    }

    /**
     * @dev Get the total number of Shmoo points for a specific user
     * @param user The address to check
     * @return The number of Shmoo points the user has generated
     */
    function getUserPoints(address user) external view returns (uint256) {
        return userPoints[user];
    }

    /**
     * @dev Check if a specific point ID exists
     * @param pointId The point ID to check
     * @return True if the point exists, false otherwise
     */
    function verifyPoint(uint256 pointId) external view returns (bool) {
        return pointExists[pointId];
    }

    /**
     * @dev Get the current point ID counter
     * @return The next point ID that will be generated
     */
    function getCurrentPointId() external view returns (uint256) {
        return pointIdCounter;
    }

    /**
     * @dev Get contract information
     * @return totalPoints Total Shmoo points generated
     * @return currentId Current point ID counter
     */
    function getContractInfo() external view returns (uint256 totalPoints, uint256 currentId) {
        return (totalShmooPoints, pointIdCounter);
    }
}
