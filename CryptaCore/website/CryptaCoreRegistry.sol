// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CryptaCoreRegistry
 * @dev Smart contract for managing verifiable digital records on blockchain
 * 
 * Features:
 * - Register digital records as immutable hashes
 * - Track ownership and transfer history
 * - Support role-based access control
 * - Emit events for transparency and audit trails
 */

contract CryptaCoreRegistry {
    
    // ========================================
    // STATE VARIABLES
    // ========================================
    
    address public owner;
    
    // Mapping of record hash to record details
    mapping(bytes32 => Record) public records;
    
    // Mapping of record hash to list of authorized verifiers
    mapping(bytes32 => address[]) public authorizedVerifiers;
    
    // Mapping of record hash to access revocation status
    mapping(bytes32 => bool) public revokedRecords;
    
    // Counter for total records
    uint256 public recordCount;
    
    // ========================================
    // DATA STRUCTURES
    // ========================================
    
    struct Record {
        bytes32 recordHash;           // Cryptographic hash of the record
        address issuer;               // Address of the issuing entity
        address recordOwner;          // Current owner of the record
        uint256 timestamp;            // Registration timestamp
        string recordType;            // Type of record (certificate, credential, license, etc.)
        string ipfsHash;              // IPFS hash for off-chain storage
        uint256 blockNumber;          // Block number when registered
        bool isValid;                 // Validity status
    }
    
    struct RecordTransfer {
        bytes32 recordHash;
        address from;
        address to;
        uint256 timestamp;
        string reason;
    }
    
    // ========================================
    // EVENTS
    // ========================================
    
    event RecordRegistered(
        bytes32 indexed recordHash,
        address indexed issuer,
        address indexed recordOwner,
        string recordType,
        uint256 timestamp
    );
    
    event RecordVerified(
        bytes32 indexed recordHash,
        address indexed verifier,
        bool isValid,
        uint256 timestamp
    );
    
    event RecordTransferred(
        bytes32 indexed recordHash,
        address indexed from,
        address indexed to,
        uint256 timestamp,
        string reason
    );
    
    event RecordRevoked(
        bytes32 indexed recordHash,
        address indexed revokedBy,
        uint256 timestamp
    );
    
    event AccessGranted(
        bytes32 indexed recordHash,
        address indexed verifier,
        uint256 timestamp
    );
    
    event AccessRevoked(
        bytes32 indexed recordHash,
        address indexed verifier,
        uint256 timestamp
    );
    
    // ========================================
    // MODIFIERS
    // ========================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyIssuer(bytes32 _recordHash) {
        require(msg.sender == records[_recordHash].issuer, "Only issuer can perform this action");
        _;
    }
    
    modifier onlyRecordOwner(bytes32 _recordHash) {
        require(msg.sender == records[_recordHash].recordOwner, "Only record owner can perform this action");
        _;
    }
    
    modifier recordExists(bytes32 _recordHash) {
        require(records[_recordHash].isValid, "Record does not exist or is invalid");
        _;
    }
    
    modifier notRevoked(bytes32 _recordHash) {
        require(!revokedRecords[_recordHash], "Record has been revoked");
        _;
    }
    
    // ========================================
    // CONSTRUCTOR
    // ========================================
    
    constructor() {
        owner = msg.sender;
        recordCount = 0;
    }
    
    // ========================================
    // CORE FUNCTIONS
    // ========================================
    
    /**
     * @dev Register a new digital record on the blockchain
     * @param _recordHash Cryptographic hash of the record
     * @param _recordOwner Address of the record owner
     * @param _recordType Type of record (certificate, credential, etc.)
     * @param _ipfsHash IPFS hash for off-chain storage
     * @return success Boolean indicating successful registration
     */
    function registerRecord(
        bytes32 _recordHash,
        address _recordOwner,
        string memory _recordType,
        string memory _ipfsHash
    ) public returns (bool success) {
        require(_recordHash != bytes32(0), "Invalid record hash");
        require(_recordOwner != address(0), "Invalid record owner address");
        require(!records[_recordHash].isValid, "Record already exists");
        
        Record memory newRecord = Record({
            recordHash: _recordHash,
            issuer: msg.sender,
            recordOwner: _recordOwner,
            timestamp: block.timestamp,
            recordType: _recordType,
            ipfsHash: _ipfsHash,
            blockNumber: block.number,
            isValid: true
        });
        
        records[_recordHash] = newRecord;
        recordCount++;
        
        emit RecordRegistered(
            _recordHash,
            msg.sender,
            _recordOwner,
            _recordType,
            block.timestamp
        );
        
        return true;
    }
    
    /**
     * @dev Verify the authenticity of a record
     * @param _recordHash Cryptographic hash of the record
     * @return isValid Boolean indicating if record is valid
     */
    function verifyRecord(bytes32 _recordHash)
        public
        recordExists(_recordHash)
        notRevoked(_recordHash)
        returns (bool isValid)
    {
        Record storage record = records[_recordHash];
        emit RecordVerified(_recordHash, msg.sender, true, block.timestamp);
        return true;
    }
    
    /**
     * @dev Transfer record ownership
     * @param _recordHash Cryptographic hash of the record
     * @param _newOwner Address of the new owner
     * @param _reason Reason for transfer
     * @return success Boolean indicating successful transfer
     */
    function transferRecord(
        bytes32 _recordHash,
        address _newOwner,
        string memory _reason
    ) public onlyRecordOwner(_recordHash) recordExists(_recordHash) notRevoked(_recordHash) returns (bool success) {
        require(_newOwner != address(0), "Invalid new owner address");
        require(_newOwner != msg.sender, "Cannot transfer to yourself");
        
        address previousOwner = records[_recordHash].recordOwner;
        records[_recordHash].recordOwner = _newOwner;
        
        emit RecordTransferred(_recordHash, previousOwner, _newOwner, block.timestamp, _reason);
        
        return true;
    }
    
    /**
     * @dev Revoke a record from the blockchain
     * @param _recordHash Cryptographic hash of the record
     * @return success Boolean indicating successful revocation
     */
    function revokeRecord(bytes32 _recordHash)
        public
        onlyIssuer(_recordHash)
        recordExists(_recordHash)
        returns (bool success)
    {
        revokedRecords[_recordHash] = true;
        records[_recordHash].isValid = false;
        
        emit RecordRevoked(_recordHash, msg.sender, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Grant verification access to an address
     * @param _recordHash Cryptographic hash of the record
     * @param _verifier Address to grant access to
     * @return success Boolean indicating successful access grant
     */
    function grantAccess(bytes32 _recordHash, address _verifier)
        public
        onlyRecordOwner(_recordHash)
        recordExists(_recordHash)
        returns (bool success)
    {
        require(_verifier != address(0), "Invalid verifier address");
        
        // Check if already authorized
        for (uint i = 0; i < authorizedVerifiers[_recordHash].length; i++) {
            if (authorizedVerifiers[_recordHash][i] == _verifier) {
                return false;
            }
        }
        
        authorizedVerifiers[_recordHash].push(_verifier);
        
        emit AccessGranted(_recordHash, _verifier, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Revoke verification access from an address
     * @param _recordHash Cryptographic hash of the record
     * @param _verifier Address to revoke access from
     * @return success Boolean indicating successful access revocation
     */
    function revokeAccess(bytes32 _recordHash, address _verifier)
        public
        onlyRecordOwner(_recordHash)
        recordExists(_recordHash)
        returns (bool success)
    {
        uint256 index = type(uint256).max;
        
        for (uint i = 0; i < authorizedVerifiers[_recordHash].length; i++) {
            if (authorizedVerifiers[_recordHash][i] == _verifier) {
                index = i;
                break;
            }
        }
        
        require(index != type(uint256).max, "Verifier not found");
        
        authorizedVerifiers[_recordHash][index] = authorizedVerifiers[_recordHash][authorizedVerifiers[_recordHash].length - 1];
        authorizedVerifiers[_recordHash].pop();
        
        emit AccessRevoked(_recordHash, _verifier, block.timestamp);
        
        return true;
    }
    
    // ========================================
    // VIEW FUNCTIONS
    // ========================================
    
    /**
     * @dev Get record details
     * @param _recordHash Cryptographic hash of the record
     * @return record The record details
     */
    function getRecord(bytes32 _recordHash)
        public
        view
        recordExists(_recordHash)
        returns (Record memory record)
    {
        return records[_recordHash];
    }
    
    /**
     * @dev Check if a record is valid
     * @param _recordHash Cryptographic hash of the record
     * @return isValid Boolean indicating if record is valid
     */
    function isRecordValid(bytes32 _recordHash) public view returns (bool isValid) {
        return records[_recordHash].isValid && !revokedRecords[_recordHash];
    }
    
    /**
     * @dev Check if an address is authorized to verify a record
     * @param _recordHash Cryptographic hash of the record
     * @param _verifier Address to check
     * @return isAuthorized Boolean indicating authorization status
     */
    function isAuthorizedVerifier(bytes32 _recordHash, address _verifier)
        public
        view
        returns (bool isAuthorized)
    {
        for (uint i = 0; i < authorizedVerifiers[_recordHash].length; i++) {
            if (authorizedVerifiers[_recordHash][i] == _verifier) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get all authorized verifiers for a record
     * @param _recordHash Cryptographic hash of the record
     * @return verifiers Array of authorized verifier addresses
     */
    function getAuthorizedVerifiers(bytes32 _recordHash)
        public
        view
        returns (address[] memory verifiers)
    {
        return authorizedVerifiers[_recordHash];
    }
    
    /**
     * @dev Get total number of registered records
     * @return count Total record count
     */
    function getTotalRecords() public view returns (uint256 count) {
        return recordCount;
    }
}
