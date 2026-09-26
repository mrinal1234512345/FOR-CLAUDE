// Mock localStorage for Node environment if not defined
if (typeof globalThis.localStorage === 'undefined') {
    const memoryStorage = new Map();
    globalThis.localStorage = {
        getItem: (k) => memoryStorage.get(k) || null,
        setItem: (k, v) => memoryStorage.set(k, String(v)),
        removeItem: (k) => memoryStorage.delete(k),
        clear: () => memoryStorage.clear()
    };
}

import { store, CryptaCoreStore, RBACManager, UIComponents, RECORD_TYPES, RECORD_STATUSES, USER_ROLES } from '../website/cryptacore-core.js';

console.log('🧪 Starting CryptaCore Automated Validation Test Suite...');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`  ❌ FAIL: ${message}`);
        failed++;
    }
}

try {
    // 1. Initial State & Seed Records
    console.log('\n--- 1. Testing Store Initialization & Seed Records ---');
    const records = store.getAllRecords();
    assert(records.length >= 8, `Store loaded ${records.length} records (expected at least 8)`);

    const licenses = store.getRecordsByType(RECORD_TYPES.LICENSE);
    assert(licenses.length >= 2, `License Portal has ${licenses.length} records`);

    const credentials = store.getRecordsByType(RECORD_TYPES.CREDENTIAL);
    assert(credentials.length >= 2, `Credential Portal has ${credentials.length} records`);

    const assets = store.getRecordsByType(RECORD_TYPES.DIGITAL_ASSET);
    assert(assets.length >= 2, `Digital Ownership Portal has ${assets.length} records`);

    const supplyChain = store.getRecordsByType(RECORD_TYPES.SUPPLY_CHAIN);
    assert(supplyChain.length >= 2, `Supply Chain Portal has ${supplyChain.length} records`);

    // 2. Record Lookup
    console.log('\n--- 2. Testing Universal Record Lookup ---');
    const lic1 = store.getRecord('LIC-2026-001');
    assert(lic1 !== null && lic1.id === 'LIC-2026-001', 'Lookup by ID "LIC-2026-001" succeeds');
    assert(lic1.recordType === RECORD_TYPES.LICENSE, 'Record type is LICENSE');

    const byHash = store.getRecord(lic1.recordHash);
    assert(byHash !== null && byHash.id === 'LIC-2026-001', 'Lookup by SHA-256 hash succeeds');

    // 3. License Issuance
    console.log('\n--- 3. Testing License Issuance Flow ---');
    const newLic = {
        id: 'LIC-2026-TEST',
        recordType: RECORD_TYPES.LICENSE,
        title: 'Advanced AI Flight Authorization',
        issuer: 'Federal Civil Aviation Directorate',
        holder: 'SkyOps Autonomous Systems',
        holderId: 'UAS-SO-991',
        creationDate: new Date().toISOString(),
        expiryDate: '2028-01-01T00:00:00Z',
        status: RECORD_STATUSES.ACTIVE,
        metadata: {
            licenseNumber: 'FCAD-UAS-2026-991',
            licenseType: 'Autonomous Delivery Fleet Class V',
            operatingJurisdiction: 'Nationwide Airspace'
        }
    };
    store.addRecord(newLic);
    const retrievedLic = store.getRecord('LIC-2026-TEST');
    assert(retrievedLic !== null, 'Newly added license retrieved from store');
    assert(retrievedLic.recordHash && retrievedLic.recordHash.startsWith('0x'), 'Deterministic record hash generated');

    // 4. Digital Ownership Transfer & Chain-of-Custody Timeline
    console.log('\n--- 4. Testing Ownership Transfer & Chain of Custody ---');
    const asset1 = store.getRecord('AST-2026-001');
    const initialOwnersCount = asset1.ownershipHistory.length;
    const transferRes = store.transferOwnership(
        'AST-2026-001',
        'Apex Global Robotics Consortium',
        'Strategic Tech Acquisition Deed #2026-99',
        'Dr. Aris Thorne',
        '0x9999888877776666555544443333222211110000'
    );
    assert(transferRes.success === true, 'Ownership transfer executed successfully');
    assert(asset1.holder === 'Apex Global Robotics Consortium', 'Asset current holder updated');
    assert(asset1.ownershipHistory.length === initialOwnersCount + 1, 'Chain of custody timeline received new node');
    assert(asset1.status === RECORD_STATUSES.TRANSFERRED, 'Asset status set to TRANSFERRED');

    // 5. Supply Chain 7-Stage Milestone Progression
    console.log('\n--- 5. Testing Supply Chain Milestone Progression ---');
    const prod1 = store.getRecord('PRD-2026-002');
    const initialEvents = prod1.supplyChainEvents.length;
    const addEventRes = store.addSupplyChainEvent('PRD-2026-002', {
        stage: 'SHIPPED',
        actor: 'Global Aerospace Freight Hub',
        location: 'Frankfurt Air Cargo Terminal 2',
        temperature: 'Ambient (18°C)',
        notes: 'Departed Frankfurt on cargo transport LH-8822.'
    });
    assert(addEventRes.success === true, 'Supply chain milestone event added');
    assert(prod1.currentStage === 'SHIPPED', 'Product currentStage updated to SHIPPED');
    assert(prod1.supplyChainEvents.length === initialEvents + 1, 'Supply chain events array extended');

    // 6. Record Revocation
    console.log('\n--- 6. Testing Record Revocation Flow ---');
    const revokeRes = store.revokeRecord('LIC-2026-002', 'Annual regulatory audit non-compliance', 'FCAD Enforcement Officer');
    assert(revokeRes.success === true, 'Record revoked successfully');
    const revokedLic = store.getRecord('LIC-2026-002');
    assert(revokedLic.status === RECORD_STATUSES.REVOKED, 'Record status is REVOKED');
    assert(revokedLic.revokeReason === 'Annual regulatory audit non-compliance', 'Revocation reason recorded');

    // 7. Record Renewal
    console.log('\n--- 7. Testing Record Renewal Flow ---');
    const renewRes = store.renewRecord('LIC-2026-TEST', '2030-01-01T00:00:00Z', 'FCAD Renewal Directorate');
    assert(renewRes.success === true, 'Record renewed successfully');
    const renewedLic = store.getRecord('LIC-2026-TEST');
    assert(renewedLic.expiryDate === '2030-01-01T00:00:00Z', 'New expiration date set');

    // 8. RBAC Permissions
    console.log('\n--- 8. Testing Role-Based Access Control (RBAC) ---');
    assert(RBACManager.hasPermission(USER_ROLES.ADMIN, 'ISSUE_LICENSE') === true, 'ADMIN has ISSUE_LICENSE permission');
    assert(RBACManager.hasPermission(USER_ROLES.HOLDER, 'ISSUE_LICENSE') === false, 'HOLDER does not have ISSUE_LICENSE permission');
    assert(RBACManager.hasPermission(USER_ROLES.HOLDER, 'SHARE_CREDENTIAL') === true, 'HOLDER has SHARE_CREDENTIAL permission');
    assert(RBACManager.hasPermission(USER_ROLES.SUPPLY_CHAIN_PARTNER, 'ADD_SUPPLY_EVENT') === true, 'SUPPLY_CHAIN_PARTNER has ADD_SUPPLY_EVENT permission');

    // 9. UI Component Renderers
    console.log('\n--- 9. Testing UI Component Renderers ---');
    const badgeHtml = UIComponents.renderStatusBadge(RECORD_STATUSES.ACTIVE);
    assert(badgeHtml.includes('ACTIVE') && badgeHtml.includes('crypta-status-badge'), 'Status badge renders correctly');

    const proofHtml = UIComponents.renderBlockchainProof(lic1);
    assert(proofHtml.includes('blockchain-proof-box') && proofHtml.includes('Record Hash (SHA-256)'), 'Blockchain proof box renders correctly');

    const timelineHtml = UIComponents.renderOwnershipTimeline(asset1.ownershipHistory);
    assert(timelineHtml.includes('ownership-node') && timelineHtml.includes('Current Owner'), 'Ownership timeline renders correctly');

    const stepperHtml = UIComponents.renderSupplyChainStepper(prod1.supplyChainEvents, prod1.currentStage);
    assert(stepperHtml.includes('supply-step') && stepperHtml.includes('MANUFACTURED'), '7-stage supply chain stepper renders correctly');

    // 10. Dashboard Stats
    console.log('\n--- 10. Testing Dashboard Aggregation Stats ---');
    const stats = store.getStats();
    assert(stats.total >= 8, `Total records: ${stats.total}`);
    assert(stats.licenses >= 3, `Licenses count: ${stats.licenses}`);
    assert(stats.credentials >= 2, `Credentials count: ${stats.credentials}`);
    assert(stats.assets >= 2, `Assets count: ${stats.assets}`);
    assert(stats.supplyChain >= 2, `Supply chain count: ${stats.supplyChain}`);
    assert(stats.revoked >= 1, `Revoked count: ${stats.revoked}`);

    console.log(`\n========================================`);
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) process.exit(1);
} catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
}
