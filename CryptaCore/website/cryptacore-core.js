/**
 * CryptaCore - Core Shared Architecture Engine
 * Common Data Model, Unified Ledger Store, RBAC Engine, and UI Component Renderers
 * Built for SIH 2026 - Problem Statement SIH26194
 */

// ============================================================================
// 1. CONFIGURATION & CONSTANTS
// ============================================================================

export const CRYPTACORE_CONFIG = {
    storageKey: 'cryptacore_unified_registry_v3',
    legacyKeys: ['cryptacore_certificates_registry_v2', 'cryptacoreRecords', 'cryptacore_certificates'],
    activityKey: 'cryptacore_activity_feed_v1',
    statsKey: 'cryptacore_system_stats_v1',
    roleKey: 'cryptacore_active_role',
    defaultNetwork: 'Local / Sepolia Simulation',
    contractAddress: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666',
    rpcUrl: 'http://127.0.0.1:7545',
    chainId: 1337,
    sepoliaChainId: 11155111
};

export const RECORD_TYPES = {
    LICENSE: 'LICENSE',
    CREDENTIAL: 'CREDENTIAL',
    DIGITAL_ASSET: 'DIGITAL_ASSET',
    SUPPLY_CHAIN: 'SUPPLY_CHAIN',
    CERTIFICATE: 'CERTIFICATE'
};

export const RECORD_STATUSES = {
    ACTIVE: 'ACTIVE',
    PENDING: 'PENDING',
    EXPIRED: 'EXPIRED',
    REVOKED: 'REVOKED',
    TRANSFERRED: 'TRANSFERRED',
    DELIVERED: 'DELIVERED',
    VERIFIED: 'VERIFIED'
};

export const SUPPLY_CHAIN_STAGES = [
    'MANUFACTURED',
    'QUALITY CHECKED',
    'PACKED',
    'SHIPPED',
    'RECEIVED',
    'INSPECTED',
    'DELIVERED'
];

export const USER_ROLES = {
    ADMIN: 'ADMIN',
    ISSUER: 'ISSUER',
    HOLDER: 'HOLDER',
    VERIFIER: 'VERIFIER',
    SUPPLY_CHAIN_PARTNER: 'SUPPLY_CHAIN_PARTNER'
};

// ============================================================================
// 2. CRYPTOGRAPHIC & UTILITY HELPERS
// ============================================================================

export class CoreCrypto {
    static async sha256Text(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static generateHash(seed = '') {
        const rand = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 64; i++) {
            hash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return hash;
    }

    static generateTxHash() {
        const chars = '0123456789abcdef';
        let tx = '0x';
        for (let i = 0; i < 64; i++) {
            tx += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return tx;
    }

    static generateWalletAddress() {
        const chars = '0123456789abcdef';
        let addr = '0x';
        for (let i = 0; i < 40; i++) {
            addr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return addr;
    }

    static generateIpfsCid() {
        const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        return `ipfs://bafybei${hex.substring(0, 30)}`;
    }
}

// ============================================================================
// 3. REALISTIC SEED DATA (ALL 5 CATEGORIES)
// ============================================================================

export const DEFAULT_UNIFIED_DATA = [
    // ------------------------------------------------------------------------
    // LICENSES (LIC-2026-xxx)
    // ------------------------------------------------------------------------
    {
        id: 'LIC-2026-001',
        recordType: RECORD_TYPES.LICENSE,
        title: 'Commercial UAS & Autonomous Drone Pilot Operating License',
        issuer: 'Federal Civil Aviation Directorate (FCAD)',
        holder: 'Capt. Elena Vance',
        holderId: 'UAS-PL-88902',
        creationDate: '2026-01-15T09:30:00Z',
        expiryDate: '2028-01-15T23:59:59Z',
        status: RECORD_STATUSES.ACTIVE,
        recordHash: '0x8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e',
        txHash: '0x4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b',
        blockNumber: 6843105,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        metadata: {
            licenseNumber: 'FCAD-UAS-2026-88902',
            licenseType: 'Commercial Drone / UAS Operator (Class IV BVR)',
            issuingAuthority: 'Federal Civil Aviation Directorate',
            operatingJurisdiction: 'Nationwide Airspace (Controlled & Uncontrolled)',
            maxTakeoffWeight: '25.0 kg',
            rating: 'Beyond Visual Line of Sight (BVLOS), Night Flight Certified',
            description: 'Full commercial license authorizing autonomous and remote drone piloting for logistics, emergency response, and infrastructure inspection.'
        },
        auditHistory: [
            {
                eventId: 'EVT-LIC-001-A',
                timestamp: '2026-01-15T09:30:00Z',
                action: 'ISSUED',
                actor: 'FCAD Licensing Authority (Admin Officer Davis)',
                actorRole: 'ISSUER',
                details: 'License issued following completion of Level IV Flight Operations & Telemetry Examination.',
                txHash: '0x4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b'
            },
            {
                eventId: 'EVT-LIC-001-B',
                timestamp: '2026-04-10T14:20:00Z',
                action: 'VERIFIED',
                actor: 'Civilian Airspace Registry Gate',
                actorRole: 'VERIFIER',
                details: 'Automated cryptographic flight clearance verification prior to autonomous corridor traversal.',
                txHash: '0x3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c'
            }
        ]
    },
    {
        id: 'LIC-2026-002',
        recordType: RECORD_TYPES.LICENSE,
        title: 'FinTech Cryptographic Asset Custody Operating License',
        issuer: 'Financial Conduct & Blockchain Oversight Board',
        holder: 'Nexis Digital Clearinghouse Ltd',
        holderId: 'CORP-GB-2024-991',
        creationDate: '2025-06-01T11:00:00Z',
        expiryDate: '2027-06-01T23:59:59Z',
        status: RECORD_STATUSES.ACTIVE,
        recordHash: '0x7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a4b6c8e0f1a3b5d',
        txHash: '0x1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b4a3f2e',
        blockNumber: 6815440,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeifx7vyx3i7k6e4s5j8m9q2w1e3r4t5y6u7i8o9p0a1s2d3f4g5h6j',
        metadata: {
            licenseNumber: 'FCOB-CUSTODY-2025-441',
            licenseType: 'Tier-1 Institutional Crypto Custody & Settlement',
            issuingAuthority: 'Financial Conduct & Blockchain Oversight Board',
            operatingJurisdiction: 'European Union & Commonwealth Markets',
            capitalRequirement: '$50,000,000 Verified Reserves',
            description: 'Regulatory authority granting Nexis Digital Clearinghouse full compliance for safeguarding digital assets and smart contract collateral.'
        },
        auditHistory: [
            {
                eventId: 'EVT-LIC-002-A',
                timestamp: '2025-06-01T11:00:00Z',
                action: 'ISSUED',
                actor: 'FCOB Regulatory Commission',
                actorRole: 'ISSUER',
                details: 'Statutory custody operating license issued upon completion of comprehensive multi-sig solvency audit.',
                txHash: '0x1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b4a3f2e'
            }
        ]
    },

    // ------------------------------------------------------------------------
    // PROFESSIONAL CREDENTIALS (CRD-2026-xxx)
    // ------------------------------------------------------------------------
    {
        id: 'CRD-2026-001',
        recordType: RECORD_TYPES.CREDENTIAL,
        title: 'Certified Lead Smart Contract Security Auditor (CLSCA)',
        issuer: 'Ethereum Security Council',
        holder: 'Marcus Sterling',
        holderId: 'AUDITOR-SEC-7741',
        creationDate: '2026-02-18T10:00:00Z',
        expiryDate: '2028-02-18T23:59:59Z',
        status: RECORD_STATUSES.ACTIVE,
        recordHash: '0x3a7b9c1d5e8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d',
        txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
        blockNumber: 6842880,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedfdewifuqw7c2vxy3mbb5q',
        metadata: {
            profession: 'Cybersecurity & Blockchain Systems',
            skill: 'Smart Contract Auditing, Reentrancy Mitigation, EVM Bytecode Decompilation, Formal Verification',
            credentialTitle: 'Certified Lead Smart Contract Security Auditor',
            issuingOrganization: 'Ethereum Security Council Certification Board',
            accreditationStandard: 'ISO/IEC 27001 & OpenZeppelin Security Standard',
            grade: 'Score: 99/100 (Master Fellow Auditor)',
            description: 'Demonstrated mastery in detecting protocol-level vulnerabilities, economic exploit vectors, flash-loan vulnerabilities, and mathematical proofs of correctness.'
        },
        auditHistory: [
            {
                eventId: 'EVT-CRD-001-A',
                timestamp: '2026-02-18T10:00:00Z',
                action: 'ISSUED',
                actor: 'Ethereum Security Council',
                actorRole: 'ISSUER',
                details: 'Credential awarded following 72-hour adversarial DeFi smart contract exploit defense exam.',
                txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e'
            }
        ]
    },
    {
        id: 'CRD-2026-002',
        recordType: RECORD_TYPES.CREDENTIAL,
        title: 'Fellow in Zero-Knowledge Cryptographic Engineering',
        issuer: 'Global Zero-Knowledge Alliance',
        holder: 'Dr. Maya Lin',
        holderId: 'ZKA-FELLOW-109',
        creationDate: '2025-11-12T15:45:00Z',
        expiryDate: '',
        status: RECORD_STATUSES.ACTIVE,
        recordHash: '0x5e8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d',
        txHash: '0x8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e',
        blockNumber: 6831090,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        metadata: {
            profession: 'Applied Mathematics & Zero-Knowledge Cryptography',
            skill: 'zk-SNARKs, zk-STARKs, Plonk, Polynomial Commitments, Recursive Proofs',
            credentialTitle: 'Distinguished Fellow in ZK Cryptographic Engineering',
            issuingOrganization: 'Global Zero-Knowledge Alliance (ZKA)',
            grade: 'Honorary Fellowship Distinction',
            description: 'Conferred in recognition of breakthrough contributions to verifiable off-chain compute and zero-knowledge privacy circuits.'
        },
        auditHistory: [
            {
                eventId: 'EVT-CRD-002-A',
                timestamp: '2025-11-12T15:45:00Z',
                action: 'ISSUED',
                actor: 'ZKA Academic Board',
                actorRole: 'ISSUER',
                details: 'Lifetime fellowship credential permanently anchored on blockchain.',
                txHash: '0x8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e'
            }
        ]
    },

    // ------------------------------------------------------------------------
    // DIGITAL OWNERSHIP (AST-2026-xxx)
    // ------------------------------------------------------------------------
    {
        id: 'AST-2026-001',
        recordType: RECORD_TYPES.DIGITAL_ASSET,
        title: 'Autonomous Vehicle Multi-Sensor AI Fusion Patent (#PAT-8812)',
        issuer: 'World Intellectual Property & Innovation Registry',
        holder: 'Apex Neural Technologies Ltd',
        holderId: 'CORP-US-DEL-4910',
        creationDate: '2025-03-10T08:00:00Z',
        expiryDate: '2045-03-10T23:59:59Z',
        status: RECORD_STATUSES.TRANSFERRED,
        recordHash: '0x2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a4b6c8e0f1a3b5d7e9f',
        txHash: '0x6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b4a3f2e1d0c9b8a7f',
        blockNumber: 6802110,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedfdewifuqw7c2vxy3mbb5q',
        metadata: {
            assetName: 'Quantum-Resistant Sensor Fusion Architecture for Autonomous Navigation',
            assetType: 'Intellectual Property / DeepTech Patent',
            creator: 'Dr. Aris Thorne',
            currentOwner: 'Apex Neural Technologies Ltd',
            originalJurisdiction: 'USPTO & WIPO International Filing',
            valuationEstimate: '$14,500,000 USD',
            description: 'Core hardware-software architectural patent covering low-latency LiDAR, Radar, and Camera multi-sensor matrix processing using neuromorphic silicon.'
        },
        ownershipHistory: [
            {
                owner: 'Dr. Aris Thorne (Inventor)',
                ownerAddress: '0x71C8364f3B7283A390638148bA4204c3e80F8d0A',
                timestamp: '2025-03-10T08:00:00Z',
                reason: 'Initial Patent Creation & Primary Cryptographic Minting',
                txHash: '0x2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a4b6c8e0f1a3b5d7e9f'
            },
            {
                owner: 'Apex Neural Technologies Ltd (Acquirer)',
                ownerAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
                timestamp: '2025-10-04T16:20:00Z',
                reason: 'Corporate Asset Acquisition & Global Commercialization Rights Agreement',
                txHash: '0x6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b4a3f2e1d0c9b8a7f'
            }
        ],
        auditHistory: [
            {
                eventId: 'EVT-AST-001-A',
                timestamp: '2025-03-10T08:00:00Z',
                action: 'REGISTERED',
                actor: 'Dr. Aris Thorne',
                actorRole: 'HOLDER',
                details: 'Primary intellectual property asset minted and anchored with cryptographic invention timestamp.',
                txHash: '0x2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a4b6c8e0f1a3b5d7e9f'
            },
            {
                eventId: 'EVT-AST-001-B',
                timestamp: '2025-10-04T16:20:00Z',
                action: 'TRANSFERRED',
                actor: 'Dr. Aris Thorne -> Apex Neural Technologies Ltd',
                actorRole: 'HOLDER',
                details: 'Full beneficial title transferred on-chain under Commercial Rights Assignment Deed.',
                txHash: '0x6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b4a3f2e1d0c9b8a7f'
            }
        ]
    },
    {
        id: 'AST-2026-002',
        recordType: RECORD_TYPES.DIGITAL_ASSET,
        title: 'Verified Amazonian Biodiversity Carbon Credit Batch (#CC-10000-MT)',
        issuer: 'Global Ecological Asset Registry & Verra Verified',
        holder: 'GreenMatrix Global Ventures',
        holderId: 'ECO-CORP-4882',
        creationDate: '2026-01-20T12:00:00Z',
        expiryDate: '2031-01-20T23:59:59Z',
        status: RECORD_STATUSES.ACTIVE,
        recordHash: '0x4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a',
        txHash: '0x5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c',
        blockNumber: 6839920,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        metadata: {
            assetName: '10,000 Metric Tonnes Carbon Dioxide Equivalent (MTCO2e) Credits',
            assetType: 'Tokenized Environmental Asset / Verified Carbon Credit',
            creator: 'Amazon Rainforest Conservation Trust',
            currentOwner: 'GreenMatrix Global Ventures',
            projectLocation: 'Madre de Dios River Basin, Peru',
            standard: 'Verra VCS + CCB Gold Level Biodiversity Certification',
            description: 'Cryptographically anchored high-permanence carbon avoidance credits generated through community-led indigenous forest protection.'
        },
        ownershipHistory: [
            {
                owner: 'Amazon Rainforest Conservation Trust',
                ownerAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
                timestamp: '2026-01-20T12:00:00Z',
                reason: 'Initial Issuance following Satellite & Drone Canopy Biomass Verification',
                txHash: '0x4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a'
            },
            {
                owner: 'GreenMatrix Global Ventures',
                ownerAddress: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666',
                timestamp: '2026-02-05T09:15:00Z',
                reason: 'Institutional Bilateral Purchase for Corporate ESG Offset Allocation',
                txHash: '0x5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c'
            }
        ],
        auditHistory: [
            {
                eventId: 'EVT-AST-002-A',
                timestamp: '2026-01-20T12:00:00Z',
                action: 'REGISTERED',
                actor: 'Amazon Rainforest Conservation Trust',
                actorRole: 'ISSUER',
                details: '10,000 verified carbon units minted on-chain following third-party audit.',
                txHash: '0x4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a'
            },
            {
                eventId: 'EVT-AST-002-B',
                timestamp: '2026-02-05T09:15:00Z',
                action: 'TRANSFERRED',
                actor: 'GreenMatrix Global Ventures',
                actorRole: 'HOLDER',
                details: 'Ownership transferred for institutional retirement portfolio.',
                txHash: '0x5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c'
            }
        ]
    },

    // ------------------------------------------------------------------------
    // SUPPLY CHAIN RECORDS (PRD-2026-xxx)
    // ------------------------------------------------------------------------
    {
        id: 'PRD-2026-001',
        recordType: RECORD_TYPES.SUPPLY_CHAIN,
        title: 'Cold-Chain Biopharmaceutical Vaccine Batch #VX-9902 (50,000 Doses)',
        issuer: 'BioShield Therapeutics AG',
        holder: 'Metro Healthcare Central Hospital',
        holderId: 'HOSP-CHI-0441',
        creationDate: '2026-02-01T06:00:00Z',
        expiryDate: '2027-02-01T23:59:59Z',
        status: RECORD_STATUSES.DELIVERED,
        recordHash: '0x1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a4b6c8e0f',
        txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        blockNumber: 6841200,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedfdewifuqw7c2vxy3mbb5q',
        metadata: {
            productName: 'BioShield UltraCold mRNA Respiratory Vaccine (VX-9902)',
            batchNumber: 'LOT-VX-9902-B7',
            manufacturer: 'BioShield Therapeutics AG (Basel Facility)',
            manufacturingDate: '2026-02-01',
            quantity: '50,000 Vials (250,000 Doses)',
            origin: 'Basel BioPark, Switzerland',
            currentLocation: 'Metro Hospital Cryo-Pharmacy, Chicago, USA',
            currentOwner: 'Metro Healthcare Alliance',
            temperatureRequirements: '-70°C ± 5°C with continuous IoT logging'
        },
        currentStage: 'DELIVERED',
        supplyChainEvents: [
            {
                eventId: 'SC-EVT-001',
                productId: 'PRD-2026-001',
                stage: 'MANUFACTURED',
                actor: 'BioShield Therapeutics Cleanroom Alpha',
                location: 'Basel BioPark, Switzerland',
                timestamp: '2026-02-01T06:00:00Z',
                previousOwner: 'N/A',
                newOwner: 'BioShield Therapeutics AG',
                temperature: '-72.4°C',
                eventHash: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
                txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
                notes: 'Formulation complete. Sterile filtration passed with 100% endotoxin clearance.'
            },
            {
                eventId: 'SC-EVT-002',
                productId: 'PRD-2026-001',
                stage: 'QUALITY CHECKED',
                actor: 'Swissmedic Independent Quality Laboratory',
                location: 'Bern, Switzerland',
                timestamp: '2026-02-02T14:30:00Z',
                previousOwner: 'BioShield Therapeutics AG',
                newOwner: 'BioShield Therapeutics AG',
                temperature: '-71.8°C',
                eventHash: '0x2222333344445555666677778888999900001111bbbbccccddddeeeeffffaaaa',
                txHash: '0x8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b9a',
                notes: 'Quality inspection passed. Potency measured at 99.4%. GMP Compliance Certificate issued.'
            },
            {
                eventId: 'SC-EVT-003',
                productId: 'PRD-2026-001',
                stage: 'PACKED',
                actor: 'AeroCryo Logistics Packaging Hub',
                location: 'Zurich Airport Logistics Centre, Switzerland',
                timestamp: '2026-02-03T18:00:00Z',
                previousOwner: 'BioShield Therapeutics AG',
                newOwner: 'Lufthansa Cargo Global Cool-Chain',
                temperature: '-73.1°C',
                eventHash: '0x3333444455556666777788889999000011112222ccccddddeeeeffffaaaabbbb',
                txHash: '0x7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b9a8b',
                notes: 'Sealed inside Dry-Ice Cryo-Containers with dual tamper-evident cryptographic IoT data loggers.'
            },
            {
                eventId: 'SC-EVT-004',
                productId: 'PRD-2026-001',
                stage: 'SHIPPED',
                actor: 'Lufthansa Cargo Transatlantic Flight LH-8204',
                location: 'Zurich (ZRH) -> Chicago O\'Hare (ORD)',
                timestamp: '2026-02-04T04:15:00Z',
                previousOwner: 'Lufthansa Cargo Cool-Chain',
                newOwner: 'US MedExpress Specialized Haulage',
                temperature: '-72.0°C',
                eventHash: '0x4444555566667777888899990000111122223333ddddeeeeffffaaaabbbbcccc',
                txHash: '0x6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b9a8b7c',
                notes: 'Direct refrigerated transatlantic cargo flight. Zero thermal excursion events recorded.'
            },
            {
                eventId: 'SC-EVT-005',
                productId: 'PRD-2026-001',
                stage: 'RECEIVED',
                actor: 'O\'Hare International Customs Terminal',
                location: 'Chicago, Illinois, USA',
                timestamp: '2026-02-04T17:40:00Z',
                previousOwner: 'Lufthansa Cargo Global Cool-Chain',
                newOwner: 'US MedExpress Specialized Haulage',
                temperature: '-71.2°C',
                eventHash: '0x5555666677778888999900001111222233334444eeeeffffaaaabbbbccccdddd',
                txHash: '0x5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b9a8b7c6d',
                notes: 'Cargo received into O\'Hare bonded cold room. Digital chain of custody transferred.'
            },
            {
                eventId: 'SC-EVT-006',
                productId: 'PRD-2026-001',
                stage: 'INSPECTED',
                actor: 'US Food & Drug Administration (FDA Port Inspector)',
                location: 'Chicago Border Inspection Post',
                timestamp: '2026-02-05T08:20:00Z',
                previousOwner: 'US MedExpress Specialized Haulage',
                newOwner: 'US MedExpress Specialized Haulage',
                temperature: '-72.6°C',
                eventHash: '0x6666777788889999000011112222333344445555ffffaaaabbbbccccddddeeee',
                txHash: '0x4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b9a8b7c6d5e',
                notes: 'FDA seal intact. IoT cryptographic temperature integrity verified. Released for final hospital delivery.'
            },
            {
                eventId: 'SC-EVT-007',
                productId: 'PRD-2026-001',
                stage: 'DELIVERED',
                actor: 'Metro Hospital Cryo-Pharmacy Directorate',
                location: 'Metro Hospital Central Cold-Storage, Chicago',
                timestamp: '2026-02-05T13:10:00Z',
                previousOwner: 'US MedExpress Specialized Haulage',
                newOwner: 'Metro Healthcare Alliance',
                temperature: '-72.9°C',
                eventHash: '0x7777888899990000111122223333444455556666aaaabbbbccccddddeeeeffff',
                txHash: '0x3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b9a8b7c6d5e4f',
                notes: 'Final custody transfer executed. Stored in Deep Cryo Freezer Rack #4-B. Ready for patient clinical distribution.'
            }
        ],
        auditHistory: [
            {
                eventId: 'EVT-PRD-001-A',
                timestamp: '2026-02-01T06:00:00Z',
                action: 'MANUFACTURED',
                actor: 'BioShield Therapeutics Cleanroom Alpha',
                actorRole: 'ISSUER',
                details: 'Vaccine batch lot created and anchored on blockchain.',
                txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
            },
            {
                eventId: 'EVT-PRD-001-B',
                timestamp: '2026-02-05T13:10:00Z',
                action: 'DELIVERED',
                actor: 'Metro Hospital Cryo-Pharmacy',
                actorRole: 'SUPPLY_CHAIN_PARTNER',
                details: 'Final milestone completed. Provenance fully verified.',
                txHash: '0x3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b9a8b7c6d5e4f'
            }
        ]
    },
    {
        id: 'PRD-2026-002',
        recordType: RECORD_TYPES.SUPPLY_CHAIN,
        title: 'Aerospace Grade Titanium Turbine Rotor Assembly #TR-4481',
        issuer: 'HyperAero Propulsion Technologies GmbH',
        holder: 'AeroTrans Specialized Air Cargo',
        holderId: 'LOG-DE-8831',
        creationDate: '2026-03-01T07:30:00Z',
        expiryDate: '',
        status: RECORD_STATUSES.ACTIVE,
        recordHash: '0x3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a4b6c8e0f1a',
        txHash: '0x2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b',
        blockNumber: 6845100,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeifx7vyx3i7k6e4s5j8m9q2w1e3r4t5y6u7i8o9p0a1s2d3f4g5h6j',
        metadata: {
            productName: 'Titanium-Aluminide High-Pressure Turbine Rotor (TR-4481)',
            batchNumber: 'LOT-HA-2026-T4',
            manufacturer: 'HyperAero Propulsion Technologies (Munich Foundry)',
            manufacturingDate: '2026-03-01',
            quantity: '1 Precision Rotor Unit',
            origin: 'Munich Foundry, Bavaria, Germany',
            currentLocation: 'Frankfurt Air Cargo Freight Hub (FRA)',
            currentOwner: 'AeroTrans Specialized Air Cargo',
            specification: 'Ti-48Al-2Cr-2Nb Alloy, EASA Flight Safety Spec 21-A'
        },
        currentStage: 'SHIPPED',
        supplyChainEvents: [
            {
                eventId: 'SC-TR-001',
                productId: 'PRD-2026-002',
                stage: 'MANUFACTURED',
                actor: 'HyperAero Advanced Metallurgy Plant',
                location: 'Munich Foundry, Germany',
                timestamp: '2026-03-01T07:30:00Z',
                previousOwner: 'N/A',
                newOwner: 'HyperAero Propulsion Technologies GmbH',
                eventHash: '0x8888999900001111222233334444555566667777aaaabbbbccccddddeeeeffff',
                txHash: '0x2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b',
                notes: 'Vacuum arc remelting and precision laser sintering complete. Ultrasound density: 100% void-free.'
            },
            {
                eventId: 'SC-TR-002',
                productId: 'PRD-2026-002',
                stage: 'QUALITY CHECKED',
                actor: 'TÜV SÜD Aerospace Inspection Division',
                location: 'Munich, Germany',
                timestamp: '2026-03-03T11:00:00Z',
                previousOwner: 'HyperAero Propulsion Technologies GmbH',
                newOwner: 'HyperAero Propulsion Technologies GmbH',
                eventHash: '0x9999000011112222333344445555666677778888bbbbccccddddeeeeffffaaaa',
                txHash: '0x1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b2a',
                notes: 'Non-destructive X-ray diffraction tests passed. Material Certificate EN 10204 3.2 issued.'
            },
            {
                eventId: 'SC-TR-003',
                productId: 'PRD-2026-002',
                stage: 'PACKED',
                actor: 'HyperAero Secure Logistics Facility',
                location: 'Munich, Germany',
                timestamp: '2026-03-04T15:30:00Z',
                previousOwner: 'HyperAero Propulsion Technologies GmbH',
                newOwner: 'AeroTrans Specialized Air Cargo',
                eventHash: '0x0000111122223333444455556666777788889999ccccddddeeeeffffaaaabbbb',
                txHash: '0x0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b2a1b',
                notes: 'Hermetically crated in nitrogen-purged shock-damped transport container.'
            },
            {
                eventId: 'SC-TR-004',
                productId: 'PRD-2026-002',
                stage: 'SHIPPED',
                actor: 'AeroTrans Specialized Air Cargo',
                location: 'En route to Boeing Aircraft Assembly, Seattle, USA',
                timestamp: '2026-03-05T09:00:00Z',
                previousOwner: 'HyperAero Propulsion Technologies GmbH',
                newOwner: 'AeroTrans Specialized Air Cargo',
                eventHash: '0x1111222233334444555566667777888899990000ddddeeeeffffaaaabbbbcccc',
                txHash: '0xc9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b2a1b0',
                notes: 'Departed Frankfurt Freight Terminal via Boeing 777F Flight AT-902.'
            }
        ],
        auditHistory: [
            {
                eventId: 'EVT-PRD-002-A',
                timestamp: '2026-03-01T07:30:00Z',
                action: 'MANUFACTURED',
                actor: 'HyperAero Advanced Metallurgy Plant',
                actorRole: 'ISSUER',
                details: 'Precision aerospace component forged and anchored to ledger.',
                txHash: '0x2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b'
            }
        ]
    },

    // ------------------------------------------------------------------------
    // CERTIFICATES (CC-2026-xxxx)
    // ------------------------------------------------------------------------
    {
        id: 'CC-2026-7842',
        recordType: RECORD_TYPES.CERTIFICATE,
        title: 'Bachelor of Technology in Blockchain Systems',
        issuer: 'CryptaCore Institute of Technology',
        holder: 'Alex Morgan',
        holderId: 'STU-2026-7842',
        creationDate: '2026-08-15T10:30:00Z',
        expiryDate: '',
        status: RECORD_STATUSES.ACTIVE,
        recordHash: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666a7b9c1d5e8f2a4b6c8e0f1a3',
        txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
        blockNumber: 6841920,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        metadata: {
            department: 'Department of Computer Science & Cybersecurity',
            credentialClassification: "Bachelor's Degree",
            grade: 'Grade A+ / 3.96 GPA (First Class with Distinction)',
            details: 'Major in Smart Contract Auditing and Distributed Systems. Capstone project on Zero-Knowledge Proofs in Decentralized Finance.'
        },
        auditHistory: [
            {
                eventId: 'EVT-CERT-001',
                timestamp: '2026-08-15T10:30:00Z',
                action: 'ISSUED',
                actor: 'CryptaCore Institute of Technology Academic Senate',
                actorRole: 'ISSUER',
                details: 'Degree officially conferred and anchored on blockchain.',
                txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e'
            }
        ]
    },
    {
        id: 'CC-2026-9014',
        recordType: RECORD_TYPES.CERTIFICATE,
        title: 'Master of Science in Cryptographic Engineering',
        issuer: 'MIT Center for Digital Currency',
        holder: 'Elena Rostova',
        holderId: 'MIT-GRAD-9014',
        creationDate: '2026-06-20T14:15:00Z',
        expiryDate: '',
        status: RECORD_STATUSES.ACTIVE,
        recordHash: '0x8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e',
        txHash: '0x4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b',
        blockNumber: 6839410,
        network: 'Sepolia (Simulated)',
        mode: 'demo',
        ipfsHash: 'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedfdewifuqw7c2vxy3mbb5q',
        metadata: {
            department: 'Graduate School of Engineering',
            credentialClassification: "Master's Degree",
            grade: 'Grade A / 4.0 GPA (Summa Cum Laude)',
            details: 'Specialization in Post-Quantum Cryptography, Lattice-Based Cryptosystems & Consensus Protocols.'
        },
        auditHistory: [
            {
                eventId: 'EVT-CERT-002',
                timestamp: '2026-06-20T14:15:00Z',
                action: 'ISSUED',
                actor: 'MIT Center for Digital Currency',
                actorRole: 'ISSUER',
                details: 'Master of Science credential anchored on Ethereum blockchain.',
                txHash: '0x4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b'
            }
        ]
    }
];

// ============================================================================
// 4. UNIFIED LEDGER STORE (CryptaCoreStore)
// ============================================================================

export class CryptaCoreStore {
    constructor() {
        this.records = [];
        this.activities = [];
        this.init();
    }

    init() {
        try {
            const hasStorage = typeof localStorage !== 'undefined';
            // Load main unified registry
            const raw = hasStorage ? localStorage.getItem(CRYPTACORE_CONFIG.storageKey) : null;
            if (raw) {
                this.records = JSON.parse(raw);
            } else {
                // Check legacy keys for existing records so we never lose user data
                let migrated = [];
                if (hasStorage) {
                    for (const k of CRYPTACORE_CONFIG.legacyKeys) {
                        const legacy = localStorage.getItem(k);
                    if (legacy) {
                        try {
                            const parsed = JSON.parse(legacy);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                migrated = migrated.concat(parsed.map(this.normalizeLegacyRecord));
                            }
                        } catch (e) {
                            console.warn('Legacy key parse err:', e);
                        }
                    }
                }
                }

                if (migrated.length > 0) {
                    // Deduplicate by ID / hash
                    const seen = new Set();
                    this.records = migrated.filter(r => {
                        const key = r.id || r.recordHash;
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                    // Merge any missing seed items
                    DEFAULT_UNIFIED_DATA.forEach(item => {
                        if (!seen.has(item.id)) {
                            this.records.push(item);
                            seen.add(item.id);
                        }
                    });
                } else {
                    this.records = JSON.parse(JSON.stringify(DEFAULT_UNIFIED_DATA));
                }
                this.save();
            }

            // Load activities feed
            const rawAct = hasStorage ? localStorage.getItem(CRYPTACORE_CONFIG.activityKey) : null;
            if (rawAct) {
                this.activities = JSON.parse(rawAct);
            } else {
                this.activities = [
                    { id: 'ACT-01', type: 'LICENSE_ISSUED', title: 'Commercial UAS License Issued', targetId: 'LIC-2026-001', actor: 'FCAD Directorate', timestamp: '2026-01-15T09:30:00Z' },
                    { id: 'ACT-02', type: 'CREDENTIAL_ISSUED', title: 'Lead Security Auditor Issued', targetId: 'CRD-2026-001', actor: 'Ethereum Security Council', timestamp: '2026-02-18T10:00:00Z' },
                    { id: 'ACT-03', type: 'ASSET_TRANSFERRED', title: 'Sensor AI Patent Transferred', targetId: 'AST-2026-001', actor: 'Dr. Aris Thorne -> Apex Neural', timestamp: '2025-10-04T16:20:00Z' },
                    { id: 'ACT-04', type: 'PRODUCT_DELIVERED', title: 'Vaccine Batch VX-9902 Delivered', targetId: 'PRD-2026-001', actor: 'Metro Healthcare Alliance', timestamp: '2026-02-05T13:10:00Z' },
                    { id: 'ACT-05', type: 'RECORD_VERIFIED', title: 'Autonomous Airspace Clearance Verified', targetId: 'LIC-2026-001', actor: 'Airspace Gate Gateway', timestamp: '2026-04-10T14:20:00Z' }
                ];
                this.saveActivities();
            }
        } catch (error) {
            console.error('CryptaCoreStore init failed:', error);
            this.records = JSON.parse(JSON.stringify(DEFAULT_UNIFIED_DATA));
        }
    }

    normalizeLegacyRecord(legacy) {
        return {
            id: legacy.id || legacy.studentRoll || 'CC-' + Math.floor(1000 + Math.random() * 9000),
            recordType: RECORD_TYPES.CERTIFICATE,
            title: legacy.credentialTitle || legacy.degreeType || 'Digital Credential',
            issuer: legacy.issuerName || legacy.issuer || 'CryptaCore Authority',
            holder: legacy.holderName || legacy.recipient || 'Authorized Recipient',
            holderId: legacy.studentRoll || legacy.recipientWallet || '',
            creationDate: legacy.issueDate || legacy.registeredAt || new Date().toISOString(),
            expiryDate: legacy.expiryDate || '',
            status: legacy.status === 'revoked' ? RECORD_STATUSES.REVOKED : RECORD_STATUSES.ACTIVE,
            recordHash: legacy.blockchainHash || legacy.recordHash || CoreCrypto.generateHash(),
            txHash: legacy.txHash || CoreCrypto.generateTxHash(),
            blockNumber: legacy.blockNumber || 6840000,
            network: legacy.network || 'Sepolia (Simulated)',
            mode: 'demo',
            ipfsHash: legacy.ipfsHash || CoreCrypto.generateIpfsCid(),
            metadata: {
                department: legacy.department || '',
                grade: legacy.grade || '',
                details: legacy.details || ''
            },
            auditHistory: [
                {
                    eventId: 'EVT-' + Math.random().toString(36).substring(2, 7),
                    timestamp: legacy.issueDate || new Date().toISOString(),
                    action: 'ISSUED',
                    actor: legacy.issuerName || 'Issuing Authority',
                    actorRole: 'ISSUER',
                    details: 'Legacy credential registered.'
                }
            ]
        };
    }

    save() {
        if (typeof localStorage === 'undefined') return;
        try {
            localStorage.setItem(CRYPTACORE_CONFIG.storageKey, JSON.stringify(this.records));
            // Also maintain sync with legacy certificate keys so legacy functions don't break
            const certsOnly = this.records.filter(r => r.recordType === RECORD_TYPES.CERTIFICATE);
            localStorage.setItem('cryptacore_certificates_registry_v2', JSON.stringify(certsOnly));
            localStorage.setItem('cryptacoreRecords', JSON.stringify(this.records));
        } catch (e) {
            console.error('CryptaCoreStore save error:', e);
        }
    }

    saveActivities() {
        if (typeof localStorage === 'undefined') return;
        try {
            localStorage.setItem(CRYPTACORE_CONFIG.activityKey, JSON.stringify(this.activities.slice(0, 50)));
        } catch (e) {
            console.error('Save activities error:', e);
        }
    }

    logActivity(type, title, targetId, actor) {
        const item = {
            id: 'ACT-' + Date.now().toString(36),
            type,
            title,
            targetId,
            actor,
            timestamp: new Date().toISOString()
        };
        this.activities.unshift(item);
        this.saveActivities();
    }

    getAllRecords() {
        return this.records;
    }

    getRecordsByType(type) {
        if (!type || type === 'ALL') return this.records;
        return this.records.filter(r => r.recordType === type);
    }

    getRecord(query) {
        if (!query) return null;
        const q = String(query).trim().toLowerCase();

        return this.records.find(r => {
            const idMatch = r.id && r.id.toLowerCase() === q;
            const hashMatch = (r.recordHash && r.recordHash.toLowerCase() === q) ||
                              (r.txHash && r.txHash.toLowerCase() === q);
            const partialHash = (r.recordHash && r.recordHash.toLowerCase().includes(q)) ||
                                (r.txHash && r.txHash.toLowerCase().includes(q));
            const nameMatch = r.holder && r.holder.toLowerCase() === q;
            const titleMatch = r.title && r.title.toLowerCase() === q;

            // Also check licenseNumber / batchNumber in metadata
            const metaLicMatch = r.metadata?.licenseNumber && r.metadata.licenseNumber.toLowerCase() === q;
            const metaBatchMatch = r.metadata?.batchNumber && r.metadata.batchNumber.toLowerCase() === q;

            return idMatch || hashMatch || metaLicMatch || metaBatchMatch || nameMatch || titleMatch || partialHash;
        }) || null;
    }

    addRecord(record) {
        // Enforce required fields
        if (!record.id) {
            record.id = 'REC-' + Date.now().toString(36).toUpperCase();
        }
        if (!record.creationDate) {
            record.creationDate = new Date().toISOString();
        }
        if (!record.status) {
            record.status = RECORD_STATUSES.ACTIVE;
        }
        if (!record.recordHash) {
            record.recordHash = CoreCrypto.generateHash();
        }
        if (!record.txHash) {
            record.txHash = CoreCrypto.generateTxHash();
        }
        if (!record.blockNumber) {
            record.blockNumber = Math.floor(6840000 + Math.random() * 10000);
        }
        if (!record.auditHistory) {
            record.auditHistory = [];
        }

        // Add primary creation audit event
        record.auditHistory.unshift({
            eventId: 'EVT-' + Date.now().toString(36),
            timestamp: record.creationDate,
            action: 'ISSUED',
            actor: record.issuer || 'System Admin',
            actorRole: 'ISSUER',
            details: `Initial record registration on CryptaCore Trust Layer. [${record.recordType}]`,
            txHash: record.txHash,
            blockchainHash: record.recordHash
        });

        this.records.unshift(record);
        this.save();

        this.logActivity(
            `${record.recordType}_ISSUED`,
            `${record.recordType} ${record.id} Registered`,
            record.id,
            record.issuer || 'Admin'
        );

        return record;
    }

    updateRecord(id, updates) {
        const idx = this.records.findIndex(r => r.id === id);
        if (idx === -1) return false;

        this.records[idx] = { ...this.records[idx], ...updates };
        this.save();
        return true;
    }

    addAuditEvent(recordId, event) {
        const record = this.records.find(r => r.id === recordId);
        if (!record) return false;

        if (!record.auditHistory) record.auditHistory = [];
        const fullEvent = {
            eventId: 'EVT-' + Date.now().toString(36),
            timestamp: new Date().toISOString(),
            ...event
        };
        record.auditHistory.push(fullEvent);
        this.save();
        return true;
    }

    // ------------------------------------------------------------------------
    // MODULE SPECIFIC ACTIONS
    // ------------------------------------------------------------------------

    renewRecord(recordId, newExpiryDate, actor = 'Admin Authority') {
        const record = this.records.find(r => r.id === recordId);
        if (!record) return { success: false, error: 'Record not found' };

        const oldExpiry = record.expiryDate || 'Permanent';
        record.expiryDate = newExpiryDate;
        record.status = RECORD_STATUSES.ACTIVE;

        const newTx = CoreCrypto.generateTxHash();
        this.addAuditEvent(recordId, {
            action: 'RENEWED',
            actor,
            actorRole: 'ISSUER',
            details: `Validity extended until ${new Date(newExpiryDate).toLocaleDateString()}. (Previous expiry: ${oldExpiry}).`,
            txHash: newTx
        });

        this.logActivity(
            'RECORD_RENEWED',
            `${record.recordType} ${record.id} Renewed`,
            record.id,
            actor
        );

        this.save();
        return { success: true, txHash: newTx, record };
    }

    revokeRecord(recordId, reason, actor = 'System Authority') {
        const record = this.records.find(r => r.id === recordId);
        if (!record) return { success: false, error: 'Record not found' };

        record.status = RECORD_STATUSES.REVOKED;
        record.revokeReason = reason;
        record.revokedAt = new Date().toISOString();
        record.revokedBy = actor;

        const newTx = CoreCrypto.generateTxHash();
        this.addAuditEvent(recordId, {
            action: 'REVOKED',
            actor,
            actorRole: 'ISSUER',
            details: `Record revoked. Mandatory reason: "${reason}".`,
            txHash: newTx
        });

        this.logActivity(
            'RECORD_REVOKED',
            `${record.recordType} ${record.id} Revoked (${reason})`,
            record.id,
            actor
        );

        this.save();
        return { success: true, txHash: newTx, record };
    }

    transferOwnership(assetId, newOwnerName, reason, actor = 'Current Owner', newOwnerAddress = '') {
        const asset = this.records.find(r => r.id === assetId && r.recordType === RECORD_TYPES.DIGITAL_ASSET);
        if (!asset) return { success: false, error: 'Digital Asset not found' };

        const previousOwner = asset.holder;
        asset.holder = newOwnerName;
        asset.status = RECORD_STATUSES.TRANSFERRED;

        if (!asset.ownershipHistory) asset.ownershipHistory = [];

        const transferTx = CoreCrypto.generateTxHash();
        const transferTimestamp = new Date().toISOString();

        asset.ownershipHistory.push({
            owner: newOwnerName,
            ownerAddress: newOwnerAddress || CoreCrypto.generateWalletAddress(),
            previousOwner,
            timestamp: transferTimestamp,
            reason: reason || 'Bilateral Cryptographic Title Transfer',
            txHash: transferTx
        });

        this.addAuditEvent(assetId, {
            action: 'TRANSFERRED',
            actor: `${previousOwner} -> ${newOwnerName}`,
            actorRole: 'HOLDER',
            details: `Ownership transferred from "${previousOwner}" to "${newOwnerName}". Reason: ${reason}`,
            txHash: transferTx
        });

        this.logActivity(
            'ASSET_TRANSFERRED',
            `Asset ${asset.id} transferred to ${newOwnerName}`,
            asset.id,
            previousOwner
        );

        this.save();
        return { success: true, txHash: transferTx, asset };
    }

    addSupplyChainEvent(productId, eventData) {
        const product = this.records.find(r => r.id === productId && r.recordType === RECORD_TYPES.SUPPLY_CHAIN);
        if (!product) return { success: false, error: 'Supply Chain Product not found' };

        if (!product.supplyChainEvents) product.supplyChainEvents = [];

        const eventHash = CoreCrypto.generateHash();
        const txHash = CoreCrypto.generateTxHash();
        const timestamp = new Date().toISOString();

        const newEvent = {
            eventId: 'SC-' + Date.now().toString(36).toUpperCase(),
            productId,
            stage: eventData.stage,
            actor: eventData.actor || 'Logistics Inspector',
            location: eventData.location || 'In Transit',
            timestamp,
            previousOwner: product.holder,
            newOwner: eventData.newOwner || product.holder,
            temperature: eventData.temperature || 'Ambient (20°C)',
            eventHash,
            txHash,
            notes: eventData.notes || `Milestone ${eventData.stage} verified and anchored.`
        };

        product.supplyChainEvents.push(newEvent);
        product.currentStage = eventData.stage;
        if (eventData.location) product.metadata.currentLocation = eventData.location;
        if (eventData.newOwner) {
            product.holder = eventData.newOwner;
            product.metadata.currentOwner = eventData.newOwner;
        }

        if (eventData.stage === 'DELIVERED') {
            product.status = RECORD_STATUSES.DELIVERED;
        }

        this.addAuditEvent(productId, {
            action: eventData.stage,
            actor: newEvent.actor,
            actorRole: 'SUPPLY_CHAIN_PARTNER',
            details: `Supply Chain Milestone: ${eventData.stage} at ${newEvent.location}. ${newEvent.notes}`,
            txHash
        });

        this.logActivity(
            `PRODUCT_${eventData.stage}`,
            `Batch ${product.id} ${eventData.stage}`,
            product.id,
            newEvent.actor
        );

        this.save();
        return { success: true, event: newEvent, product };
    }

    getStats() {
        const total = this.records.length;
        const licenses = this.records.filter(r => r.recordType === RECORD_TYPES.LICENSE).length;
        const activeLicenses = this.records.filter(r => r.recordType === RECORD_TYPES.LICENSE && r.status === RECORD_STATUSES.ACTIVE).length;
        const credentials = this.records.filter(r => r.recordType === RECORD_TYPES.CREDENTIAL).length;
        const assets = this.records.filter(r => r.recordType === RECORD_TYPES.DIGITAL_ASSET).length;
        const supplyChain = this.records.filter(r => r.recordType === RECORD_TYPES.SUPPLY_CHAIN).length;
        const certificates = this.records.filter(r => r.recordType === RECORD_TYPES.CERTIFICATE).length;
        const revoked = this.records.filter(r => r.status === RECORD_STATUSES.REVOKED).length;
        const expired = this.records.filter(r => {
            if (r.status === RECORD_STATUSES.EXPIRED) return true;
            if (r.expiryDate && new Date(r.expiryDate) < new Date()) return true;
            return false;
        }).length;

        const rawVerifCount = parseInt(localStorage.getItem('cryptacore_verification_counter') || '142', 10);

        return {
            total,
            licenses,
            activeLicenses,
            credentials,
            assets,
            supplyChain,
            certificates,
            revoked,
            expired,
            verificationRequests: rawVerifCount
        };
    }

    incrementVerificationCounter() {
        const count = parseInt(localStorage.getItem('cryptacore_verification_counter') || '142', 10) + 1;
        localStorage.setItem('cryptacore_verification_counter', String(count));
        return count;
    }
}

// Global Singleton Instance
export const store = new CryptaCoreStore();
if (typeof window !== 'undefined') {
    window.CryptaCoreStore = store;
}

// ============================================================================
// 5. ROLE-BASED ACCESS CONTROL (RBAC) ENGINE
// ============================================================================

export class RBACManager {
    static getRole() {
        if (typeof window === 'undefined') return USER_ROLES.ADMIN;
        return localStorage.getItem(CRYPTACORE_CONFIG.roleKey) || USER_ROLES.ADMIN;
    }

    static setRole(role) {
        if (!Object.values(USER_ROLES).includes(role)) {
            console.error('Invalid role:', role);
            return;
        }
        localStorage.setItem(CRYPTACORE_CONFIG.roleKey, role);
        document.dispatchEvent(new CustomEvent('cryptacore:role-changed', { detail: { role } }));
    }

    static getRoleDetails(role = this.getRole()) {
        const roleMap = {
            [USER_ROLES.ADMIN]: {
                name: 'Administrator',
                badge: 'ADMIN',
                color: '#2563eb',
                icon: 'fa-shield-alt',
                description: 'Full institutional authority: issue, transfer, renew, revoke across all portals.'
            },
            [USER_ROLES.ISSUER]: {
                name: 'Accredited Issuer',
                badge: 'ISSUER',
                color: '#10b981',
                icon: 'fa-feather-pointed',
                description: 'Authorized to mint and manage official credentials and operating licenses.'
            },
            [USER_ROLES.HOLDER]: {
                name: 'Credential / Asset Holder',
                badge: 'HOLDER',
                color: '#8b5cf6',
                icon: 'fa-user-graduate',
                description: 'View "My Credentials", generate shareable verification links, and initiate asset transfers.'
            },
            [USER_ROLES.VERIFIER]: {
                name: 'Public Verifier',
                badge: 'VERIFIER',
                color: '#06b6d4',
                icon: 'fa-magnifying-glass',
                description: 'Restricted to public verification lookups without administrative issuance privileges.'
            },
            [USER_ROLES.SUPPLY_CHAIN_PARTNER]: {
                name: 'Supply Chain Logistics Partner',
                badge: 'PARTNER',
                color: '#f59e0b',
                icon: 'fa-truck-fast',
                description: 'Authorized to record quality checks, shipments, and custody handoffs.'
            }
        };
        return roleMap[role] || roleMap[USER_ROLES.ADMIN];
    }

    static hasPermission(role, action) {
        if (role === USER_ROLES.ADMIN) return true;

        switch (action) {
            case 'ISSUE_RECORD':
            case 'ISSUE_LICENSE':
            case 'ISSUE_CREDENTIAL':
                return role === USER_ROLES.ISSUER;

            case 'REVOKE_RECORD':
                return role === USER_ROLES.ADMIN || role === USER_ROLES.ISSUER;

            case 'RENEW_RECORD':
                return role === USER_ROLES.ADMIN || role === USER_ROLES.ISSUER;

            case 'TRANSFER_ASSET':
                return role === USER_ROLES.ADMIN || role === USER_ROLES.HOLDER;

            case 'ADD_SUPPLY_EVENT':
                return role === USER_ROLES.ADMIN || role === USER_ROLES.SUPPLY_CHAIN_PARTNER;

            case 'VIEW_HOLDER_VIEW':
            case 'SHARE_CREDENTIAL':
                return true;

            case 'VERIFY_RECORD':
                return true;

            default:
                return false;
        }
    }

    static can(action, context = {}) {
        return this.hasPermission(this.getRole(), action);
    }
}

if (typeof window !== 'undefined') {
    window.RBACManager = RBACManager;
}

// ============================================================================
// 6. REUSABLE UI COMPONENT RENDERERS
// ============================================================================

export class UIComponents {
    static renderStatusBadge(status) {
        const s = (status || 'ACTIVE').toUpperCase();
        let bg = 'rgba(16, 185, 129, 0.15)';
        let color = '#10b981';
        let icon = 'fa-circle-check';

        if (s === 'REVOKED') {
            bg = 'rgba(239, 68, 68, 0.15)';
            color = '#ef4444';
            icon = 'fa-ban';
        } else if (s === 'EXPIRED') {
            bg = 'rgba(245, 158, 11, 0.15)';
            color = '#f59e0b';
            icon = 'fa-clock';
        } else if (s === 'TRANSFERRED') {
            bg = 'rgba(139, 92, 246, 0.15)';
            color = '#8b5cf6';
            icon = 'fa-arrow-right-arrow-left';
        } else if (s === 'DELIVERED') {
            bg = 'rgba(6, 182, 212, 0.15)';
            color = '#06b6d4';
            icon = 'fa-box-open';
        } else if (s === 'PENDING') {
            bg = 'rgba(100, 116, 139, 0.15)';
            color = '#94a3b8';
            icon = 'fa-hourglass-half';
        }

        return `
            <span class="crypta-status-badge" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; background: ${bg}; color: ${color}; border: 1px solid ${color}40;">
                <i class="fas ${icon}"></i> ${s}
            </span>
        `;
    }

    static renderBlockchainProof(record) {
        const isLive = record.mode === 'live';
        const badgeMode = isLive 
            ? `<span class="mode-tag mode-live" style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700;"><i class="fas fa-cube"></i> Sepolia Blockchain Connected</span>`
            : `<span class="mode-tag mode-demo" style="background: rgba(37, 99, 235, 0.15); color: #3b82f6; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700;"><i class="fas fa-shield-halved"></i> CryptaCore Trust Layer (Demo Mode)</span>`;

        return `
            <div class="blockchain-proof-box" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem; margin-top: 1.2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.6rem;">
                    <strong style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--text-primary);">
                        <i class="fas fa-link text-primary"></i> Cryptographic Blockchain Proof
                    </strong>
                    ${badgeMode}
                </div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 0.6rem; font-size: 0.85rem;">
                    <div>
                        <span style="color: var(--text-secondary); display: block; font-size: 0.75rem; text-transform: uppercase;">Record Hash (SHA-256):</span>
                        <code style="display: block; background: var(--bg-primary); padding: 0.35rem 0.6rem; border-radius: 4px; font-family: monospace; word-break: break-all; color: var(--primary-color); font-size: 0.8rem; margin-top: 0.2rem;">${record.recordHash}</code>
                    </div>
                    <div>
                        <span style="color: var(--text-secondary); display: block; font-size: 0.75rem; text-transform: uppercase;">Transaction Reference ID:</span>
                        <code style="display: block; background: var(--bg-primary); padding: 0.35rem 0.6rem; border-radius: 4px; font-family: monospace; word-break: break-all; color: #10b981; font-size: 0.8rem; margin-top: 0.2rem;">${record.txHash}</code>
                    </div>
                    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.4rem; color: var(--text-secondary); font-size: 0.8rem;">
                        <span><strong>Block Height:</strong> #${record.blockNumber || '6842000'}</span>
                        <span><strong>Network:</strong> ${record.network || 'Sepolia (Simulated)'}</span>
                        ${record.ipfsHash ? `<span><strong>IPFS CID:</strong> <a href="#" style="color: var(--primary-color); word-break: break-all;">${record.ipfsHash.substring(0, 22)}...</a></span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    static renderAuditTimeline(auditHistory = []) {
        if (!auditHistory || auditHistory.length === 0) {
            return '<p style="color: var(--text-secondary); font-size: 0.9rem; padding: 1rem 0;">No audit events recorded.</p>';
        }

        const items = auditHistory.map((evt, idx) => {
            let icon = 'fa-circle-check';
            let color = '#10b981';

            if (evt.action === 'REVOKED') {
                icon = 'fa-ban';
                color = '#ef4444';
            } else if (evt.action === 'TRANSFERRED') {
                icon = 'fa-arrow-right-arrow-left';
                color = '#8b5cf6';
            } else if (evt.action === 'RENEWED') {
                icon = 'fa-rotate';
                color = '#3b82f6';
            } else if (evt.action === 'DELIVERED') {
                icon = 'fa-box-open';
                color = '#06b6d4';
            }

            return `
                <div class="timeline-step" style="display: flex; gap: 1.25rem; position: relative; padding-bottom: 1.5rem;">
                    ${idx < auditHistory.length - 1 ? `<div style="position: absolute; left: 18px; top: 36px; bottom: 0; width: 2px; background: var(--border-color);"></div>` : ''}
                    <div class="timeline-icon" style="width: 36px; height: 36px; border-radius: 50%; background: ${color}20; color: ${color}; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; z-index: 1; flex-shrink: 0; border: 2px solid ${color};">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="timeline-body" style="flex: 1; background: var(--bg-secondary); padding: 0.85rem 1.1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                            <strong style="font-size: 0.9rem; color: var(--text-primary);">${evt.action}</strong>
                            <span style="font-size: 0.75rem; color: var(--text-secondary);">${new Date(evt.timestamp).toLocaleString()}</span>
                        </div>
                        <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.3rem;">
                            <strong>Actor:</strong> ${evt.actor} ${evt.actorRole ? `<span style="font-size: 0.7rem; background: var(--border-color); padding: 0.15rem 0.4rem; border-radius: 4px; margin-left: 0.3rem;">${evt.actorRole}</span>` : ''}
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-primary); margin: 0.4rem 0 0;">${evt.details}</p>
                        ${evt.txHash ? `<div style="font-size: 0.75rem; color: var(--primary-color); font-family: monospace; word-break: break-all; margin-top: 0.35rem;">Tx: ${evt.txHash}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `<div class="crypta-timeline" style="margin-top: 1rem;">${items}</div>`;
    }

    static renderOwnershipTimeline(ownershipHistory = []) {
        if (!ownershipHistory || ownershipHistory.length === 0) {
            return '<p style="color: var(--text-secondary); font-size: 0.9rem;">No transfer history recorded. Original creator owns asset.</p>';
        }

        const nodes = ownershipHistory.map((item, idx) => {
            const isLatest = idx === ownershipHistory.length - 1;
            return `
                <div class="ownership-node ${isLatest ? 'node-current' : 'node-past'}" style="flex: 1; min-width: 200px; background: var(--bg-secondary); border: 2px solid ${isLatest ? 'var(--primary-color)' : 'var(--border-color)'}; border-radius: 8px; padding: 1rem; position: relative;">
                    ${isLatest ? '<div style="position: absolute; top: -10px; right: 10px; background: var(--primary-color); color: white; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px; text-transform: uppercase;">Current Owner</div>' : ''}
                    <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">
                        ${idx === 0 ? '<i class="fas fa-crown"></i> Creator / Initial Mint' : `<i class="fas fa-arrow-right"></i> Transfer #${idx}`}
                    </div>
                    <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary); margin: 0.35rem 0;">
                        ${item.owner}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); word-break: break-all; font-family: monospace;">
                        ${item.ownerAddress || '0x...'}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem; border-top: 1px dashed var(--border-color); padding-top: 0.4rem;">
                        <strong>Date:</strong> ${new Date(item.timestamp).toLocaleDateString()}<br>
                        <strong>Reason:</strong> ${item.reason}
                    </div>
                </div>
                ${idx < ownershipHistory.length - 1 ? `
                    <div class="ownership-connector" style="display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: var(--primary-color); padding: 0 0.5rem;">
                        <i class="fas fa-angles-right"></i>
                    </div>
                ` : ''}
            `;
        }).join('');

        return `
            <div class="ownership-timeline-container" style="display: flex; align-items: stretch; gap: 0.75rem; overflow-x: auto; padding: 1rem 0;">
                ${nodes}
            </div>
        `;
    }

    static renderSupplyChainStepper(supplyChainEvents = [], currentStage = 'MANUFACTURED') {
        const completedStages = new Set((supplyChainEvents || []).map(e => e.stage));

        const steps = SUPPLY_CHAIN_STAGES.map((stage, idx) => {
            const isCompleted = completedStages.has(stage);
            const isCurrent = stage === currentStage;
            const eventData = (supplyChainEvents || []).find(e => e.stage === stage);

            let icon = 'fa-circle';
            let color = 'var(--text-secondary)';
            let bgColor = 'var(--bg-secondary)';
            let borderColor = 'var(--border-color)';

            if (isCompleted || isCurrent) {
                icon = 'fa-check';
                color = '#ffffff';
                bgColor = isCurrent ? '#06b6d4' : '#10b981';
                borderColor = isCurrent ? '#06b6d4' : '#10b981';
            }

            return `
                <div class="supply-step ${isCurrent ? 'step-current' : ''} ${isCompleted ? 'step-done' : ''}" style="flex: 1; text-align: center; position: relative; min-width: 110px;">
                    ${idx < SUPPLY_CHAIN_STAGES.length - 1 ? `
                        <div style="position: absolute; top: 18px; left: 50%; right: -50%; height: 3px; background: ${completedStages.has(SUPPLY_CHAIN_STAGES[idx + 1]) ? '#10b981' : 'var(--border-color)'}; z-index: 0;"></div>
                    ` : ''}
                    <div class="step-circle" style="width: 38px; height: 38px; border-radius: 50%; background: ${bgColor}; border: 3px solid ${borderColor}; color: ${color}; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.5rem; position: relative; z-index: 1; font-weight: 700; font-size: 0.85rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: ${isCurrent ? '#06b6d4' : (isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)')};">
                        ${stage}
                    </div>
                    ${eventData ? `
                        <div style="font-size: 0.68rem; color: var(--text-secondary); margin-top: 0.2rem;">
                            ${new Date(eventData.timestamp).toLocaleDateString()}
                        </div>
                    ` : '<div style="font-size: 0.68rem; color: var(--text-secondary); margin-top: 0.2rem; opacity: 0.6;">Pending</div>'}
                </div>
            `;
        }).join('');

        return `
            <div class="supply-chain-stepper" style="display: flex; justify-content: space-between; align-items: flex-start; padding: 1.5rem 0; overflow-x: auto; gap: 0.5rem;">
                ${steps}
            </div>
        `;
    }

    static showToast(message, type = 'info', duration = 4000) {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type}`;

        const iconMap = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };

        toast.innerHTML = `
            <i class="fas ${iconMap[type] || 'fa-info-circle'} toast-icon"></i>
            <div class="toast-content" style="flex: 1;">${message}</div>
            <button class="toast-close" type="button" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: inherit;">&times;</button>
        `;

        toast.querySelector('.toast-close').onclick = () => {
            toast.remove();
        };

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }
}

if (typeof window !== 'undefined') {
    window.UIComponents = UIComponents;
    window.CRYPTACORE_CONFIG = CRYPTACORE_CONFIG;
    window.RECORD_TYPES = RECORD_TYPES;
    window.RECORD_STATUSES = RECORD_STATUSES;
    window.SUPPLY_CHAIN_STAGES = SUPPLY_CHAIN_STAGES;
    window.USER_ROLES = USER_ROLES;
    window.CoreCrypto = CoreCrypto;
}
