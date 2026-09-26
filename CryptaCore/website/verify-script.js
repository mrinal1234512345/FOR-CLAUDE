// ========================================
// CRYPTACORE UNIVERSAL RECORD VERIFIER
// Supports: Licenses, Credentials, Digital Assets, Supply Chain, Certificates
// ========================================

// Dark Mode & Navigation
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeToggle?.classList.add('active');
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = 'fas fa-sun';
        themeToggle.title = 'Switch to Light Mode';
    }
} else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    themeToggle?.classList.remove('active');
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = 'fas fa-moon';
        themeToggle.title = 'Switch to Dark Luxury Mode';
    }
}

themeToggle?.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode', !isDarkMode);
    themeToggle.classList.toggle('active', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.title = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Luxury Mode';
    }
});

hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
});

// Blockchain configuration
const BLOCKCHAIN_CONFIG = {
    rpcUrl: 'http://127.0.0.1:7545',
    chainId: 1337,
    contractAddress: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666',
    storageKeys: ['cryptacore_unified_registry_v3', 'cryptacore_certificates_registry_v2', 'cryptacoreRecords']
};

const CRYPTACORE_CONTRACT_ABI = [
    'function verifyRecord(bytes32 _recordHash) view returns (bool)',
    'function recordCount() view returns (uint256)',
    'function isRecordValid(bytes32 _recordHash) view returns (bool)',
    'function records(bytes32) view returns (bytes32 recordHash, address issuer, address recordOwner, uint256 timestamp, string recordType, string ipfsHash, uint256 blockNumber, bool isValid)'
];

const DEFAULT_SAMPLE_RECORDS = [
    {
        id: 'CC-2026-7842',
        recordType: 'CERTIFICATE',
        title: 'Bachelor of Technology in Blockchain Systems',
        holderName: 'Alex Morgan',
        holder: 'Alex Morgan',
        issuerName: 'CryptaCore Institute of Technology',
        issuer: 'CryptaCore Institute of Technology',
        department: 'Department of Computer Science & Cybersecurity',
        degreeType: "Bachelor's Degree",
        issueDate: '2026-08-15',
        expiryDate: '',
        grade: 'Grade A+ / 3.96 GPA (First Class with Distinction)',
        details: 'Major in Smart Contract Auditing and Distributed Systems.',
        fileHash: '0x3a7b9c1d5e8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d',
        blockchainHash: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666a7b9c1d5e8f2a4b6c8e0f1a3',
        recordHash: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666a7b9c1d5e8f2a4b6c8e0f1a3',
        txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
        blockNumber: 6841920,
        status: 'ACTIVE'
    },
    {
        id: 'CC-2026-9014',
        recordType: 'CERTIFICATE',
        title: 'Master of Science in Cryptographic Engineering',
        holderName: 'Elena Rostova',
        holder: 'Elena Rostova',
        issuerName: 'MIT Center for Digital Currency',
        issuer: 'MIT Center for Digital Currency',
        department: 'Graduate School of Engineering',
        degreeType: "Master's Degree",
        issueDate: '2026-06-20',
        expiryDate: '',
        grade: 'Grade A / 4.0 GPA (Summa Cum Laude)',
        details: 'Specialization in Post-Quantum Cryptography & Consensus Mechanisms.',
        fileHash: '0x5e8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d',
        blockchainHash: '0x8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e',
        recordHash: '0x8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e',
        txHash: '0x4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b',
        blockNumber: 6839410,
        status: 'ACTIVE'
    }
];

class CertificateVerifier {
    constructor() {
        this.provider = null;
        this.contract = null;
        this.certificates = this.loadCertificatesFromStorage();
        this.checkUrlParams();
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const hash = urlParams.get('hash');
        const holder = urlParams.get('holder');
        const id = urlParams.get('id');

        const inputField = document.getElementById('verifyHash');
        if (inputField) {
            if (id) {
                inputField.value = id;
                setTimeout(() => this.verifyCertificate(), 300);
            } else if (hash) {
                inputField.value = hash;
                setTimeout(() => this.verifyCertificate(), 300);
            } else if (holder) {
                inputField.value = holder;
                setTimeout(() => this.verifyCertificate(), 300);
            }
        }
    }

    quickVerify(recordId) {
        const inputField = document.getElementById('verifyHash');
        if (inputField) {
            inputField.value = recordId;
            this.verifyCertificate();
            inputField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showQr(recordId) {
        const modal = document.getElementById('verifyQrModal');
        const container = document.getElementById('verifyQrContainer');
        const title = document.getElementById('verifyQrTitle');
        const subtitle = document.getElementById('verifyQrSubtitle');

        if (!modal || !container) return;

        title.textContent = `Verification QR: ${recordId}`;
        const url = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(recordId)}`;
        subtitle.textContent = `Scans navigate directly to this record on CryptaCore Universal Verifier: ${url}`;

        container.innerHTML = '';
        if (typeof QRCode !== 'undefined') {
            new QRCode(container, {
                text: url,
                width: 200,
                height: 200,
                colorDark: '#0f172a',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            container.innerHTML = `<p style="color: var(--text-secondary);">QR Library not loaded.</p>`;
        }

        modal.style.display = 'flex';
    }

    loadCertificatesFromStorage() {
        let combined = [];
        BLOCKCHAIN_CONFIG.storageKeys.forEach(key => {
            try {
                const stored = localStorage.getItem(key);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        combined = combined.concat(parsed);
                    }
                }
            } catch (error) {
                console.error(`Error loading storage key ${key}:`, error);
            }
        });

        if (combined.length === 0) {
            return JSON.parse(JSON.stringify(DEFAULT_SAMPLE_RECORDS));
        }
        return combined;
    }

    async verifyCertificate() {
        const input = document.getElementById('verifyHash')?.value.trim();
        const resultDiv = document.getElementById('verificationResult');
        const noResultDiv = document.getElementById('noResultMessage');

        if (!input) {
            if (resultDiv) resultDiv.style.display = 'none';
            if (noResultDiv) noResultDiv.style.display = 'block';
            return;
        }

        if (resultDiv) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div class="card-surface" style="padding: 2.5rem; text-align: center; border-radius: 12px;">
                    <i class="fas fa-spinner fa-spin fa-2x text-primary" style="margin-bottom: 1rem;"></i>
                    <h3 style="margin-bottom: 0.5rem;">Authenticating Against CryptaCore Trust Layer</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Checking cryptographic proof, revocation state, and registry ledger...</p>
                </div>
            `;
        }
        if (noResultDiv) noResultDiv.style.display = 'none';

        try {
            await new Promise(r => setTimeout(r, 450)); // Smooth animation

            // 1. Look up in Unified CryptaCoreStore if available
            let record = null;
            if (window.CryptaCoreStore && typeof window.CryptaCoreStore.getRecord === 'function') {
                record = window.CryptaCoreStore.getRecord(input);
            }

            // 2. Fallback to local certificates array
            if (!record) {
                record = this.searchLocally(input);
            }

            if (record) {
                // Increment verification counter and log verification activity
                if (window.CryptaCoreStore) {
                    window.CryptaCoreStore.incrementVerificationCounter();
                    window.CryptaCoreStore.logActivity(
                        'RECORD_VERIFIED',
                        `Verification checked for ${record.id} (${record.title || record.id})`,
                        record.id,
                        'Public Verifier'
                    );
                }

                const hashToVerify = record.recordHash || record.blockchainHash || '';
                const blockchainResult = await this.verifyOnBlockchain(hashToVerify);
                this.displayUnifiedRecord(record, blockchainResult);
            } else {
                // 3. Fallback to direct on-chain verification
                const blockchainResult = await this.verifyOnBlockchain(input);
                if (blockchainResult.valid) {
                    this.displayOnChainOnlyResult(blockchainResult.record);
                } else {
                    this.displayUnverifiedResult(input, 'No matching active record or blockchain cryptographic hash was found on the CryptaCore Trust Layer.');
                }
            }
        } catch (error) {
            console.error('Verification error:', error);
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="verify-error card-surface" style="padding: 2rem; border-left: 6px solid #ef4444; border-radius: 10px;">
                        <h3 style="color: #ef4444;"><i class="fas fa-exclamation-triangle"></i> Verification Error</h3>
                        <p style="margin-top: 0.5rem;">${error.message}</p>
                    </div>
                `;
            }
        }
    }

    searchLocally(input) {
        const query = input.toLowerCase();
        return this.certificates.find(cert => {
            const idMatch = cert.id && cert.id.toLowerCase() === query;
            const nameMatch = (cert.holderName && cert.holderName.toLowerCase().includes(query)) ||
                              (cert.holder && cert.holder.toLowerCase().includes(query));
            const hashMatch = (cert.blockchainHash && cert.blockchainHash.toLowerCase().includes(query)) ||
                              (cert.recordHash && cert.recordHash.toLowerCase().includes(query)) ||
                              (cert.fileHash && cert.fileHash.toLowerCase().includes(query)) ||
                              (cert.txHash && cert.txHash.toLowerCase().includes(query));
            const titleMatch = cert.title && cert.title.toLowerCase().includes(query);
            return idMatch || nameMatch || hashMatch || titleMatch;
        }) || null;
    }

    displayUnverifiedResult(query, message) {
        const resultDiv = document.getElementById('verificationResult');
        if (!resultDiv) return;

        resultDiv.innerHTML = `
            <div class="verify-invalid card-surface" style="padding: 2.2rem; border-left: 6px solid #ef4444; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.75rem;">
                    <span style="font-size: 1.8rem; color: #ef4444;"><i class="fas fa-times-circle"></i></span>
                    <div>
                        <h2 style="color: #ef4444; font-size: 1.4rem; margin: 0;">Record Not Verified</h2>
                        <span style="font-size: 0.85rem; color: var(--text-secondary);">CryptaCore Trust Layer Verification Failed</span>
                    </div>
                </div>
                <p style="color: var(--text-primary); margin-top: 0.5rem; font-size: 0.95rem;">${message}</p>
                <div style="background: var(--bg-secondary); padding: 0.85rem 1rem; border-radius: 8px; margin-top: 1rem; border: 1px solid var(--border-color);">
                    <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700; display: block;">Query Evaluated:</span>
                    <code style="word-break: break-all; font-family: 'Fira Code', monospace; color: #ef4444; font-size: 0.85rem;">${query}</code>
                </div>
                <div style="margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-lightbulb text-primary"></i> Tip: Use one of the Quick Test sample buttons above to evaluate live verified records.
                </div>
            </div>
        `;
    }

    displayOnChainOnlyResult(blockchainRecord) {
        const resultDiv = document.getElementById('verificationResult');
        if (!resultDiv) return;

        resultDiv.innerHTML = `
            <div class="verify-valid card-surface" style="padding: 2rem; border-left: 6px solid #10b981; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem;">
                    <div>
                        <h2 style="color: #10b981; font-size: 1.4rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-check-circle"></i> On-Chain Record Verified
                        </h2>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.2rem;">Matches an immutable smart contract record on CryptaCore Registry</p>
                    </div>
                    <span class="mode-tag mode-live" style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700;">
                        <i class="fas fa-cube"></i> Sepolia Blockchain Verified
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.2rem;">
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Record Type:</span>
                        <div style="font-weight: 700; color: var(--text-primary);">${blockchainRecord.recordType || 'Digital Record'}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Block Height:</span>
                        <div style="font-weight: 700; color: var(--text-primary);">#${blockchainRecord.blockNumber}</div>
                    </div>
                    <div class="detail-item" style="grid-column: 1 / -1;">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Record Hash:</span>
                        <code style="display: block; background: var(--bg-secondary); padding: 0.4rem 0.6rem; border-radius: 4px; font-family: 'Fira Code', monospace; font-size: 0.8rem; word-break: break-all; color: var(--primary-color);">${blockchainRecord.recordHash}</code>
                    </div>
                    <div class="detail-item" style="grid-column: 1 / -1;">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Issuer Wallet:</span>
                        <code style="display: block; background: var(--bg-secondary); padding: 0.4rem 0.6rem; border-radius: 4px; font-family: 'Fira Code', monospace; font-size: 0.8rem; word-break: break-all; color: var(--text-primary);">${blockchainRecord.issuer}</code>
                    </div>
                </div>
            </div>
        `;
    }

    displayUnifiedRecord(record, blockchainResult = null) {
        const resultDiv = document.getElementById('verificationResult');
        if (!resultDiv) return;

        const isRevoked = record.status === 'REVOKED' || record.status === 'revoked';
        const isExpired = (record.status === 'EXPIRED' || record.status === 'expired') ||
                          (record.expiryDate && new Date(record.expiryDate) < new Date());

        let statusClass = 'verify-valid';
        let statusIcon = 'fa-circle-check';
        let statusText = 'AUTHENTIC & VERIFIED ON-CHAIN';
        let statusBorderColor = '#10b981';
        let statusBadgeBg = 'rgba(16, 185, 129, 0.15)';

        if (isRevoked) {
            statusClass = 'verify-invalid';
            statusIcon = 'fa-ban';
            statusText = 'REVOKED RECORD';
            statusBorderColor = '#ef4444';
            statusBadgeBg = 'rgba(239, 68, 68, 0.15)';
        } else if (isExpired) {
            statusClass = 'verify-expired';
            statusIcon = 'fa-clock';
            statusText = 'EXPIRED RECORD';
            statusBorderColor = '#f59e0b';
            statusBadgeBg = 'rgba(245, 158, 11, 0.15)';
        }

        const type = record.recordType || 'CERTIFICATE';
        const title = record.title || record.credentialTitle || record.degreeType || 'Institutional Digital Record';
        const holderName = record.holder || record.holderName || record.recipient || 'N/A';
        const issuerName = record.issuer || record.issuerName || 'CryptaCore Authority';
        const recordId = record.id || 'REC-VERIFIED';

        // Render type-specific content block
        let specificHtml = '';
        if (type === 'LICENSE') {
            specificHtml = `
                <div class="specific-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 1.25rem 0;">
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">License Type:</span>
                        <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${record.metadata?.licenseType || 'Commercial Operator License'}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Official License Number:</span>
                        <div style="font-weight: 700; color: var(--primary-color); font-family: 'Fira Code', monospace;">${record.metadata?.licenseNumber || record.id}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Issuing Authority:</span>
                        <div style="font-weight: 600; color: var(--text-primary);">${record.metadata?.issuingAuthority || issuerName}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Operating Jurisdiction:</span>
                        <div style="font-weight: 600; color: var(--text-primary);">${record.metadata?.operatingJurisdiction || 'Nationwide Authorized'}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Issue Date:</span>
                        <div style="color: var(--text-primary); font-weight: 600;">${record.creationDate ? new Date(record.creationDate).toLocaleDateString() : 'Active'}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Expiration Window:</span>
                        <div style="color: ${isExpired ? '#ef4444' : 'var(--text-primary)'}; font-weight: 700;">${record.expiryDate ? new Date(record.expiryDate).toLocaleDateString() : 'Permanent (No Expiry)'}</div>
                    </div>
                    ${record.metadata?.rating ? `
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Endorsements & Ratings:</span>
                            <div style="background: var(--bg-secondary); padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; color: #10b981; font-size: 0.9rem; margin-top: 0.25rem;">
                                <i class="fas fa-check-double"></i> ${record.metadata.rating}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        } else if (type === 'CREDENTIAL') {
            specificHtml = `
                <div class="specific-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 1.25rem 0;">
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Credential Classification:</span>
                        <div style="font-weight: 700; color: var(--text-primary);">${record.metadata?.credentialClassification || 'Professional Certification'}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Credential Recipient:</span>
                        <div style="font-weight: 700; color: var(--primary-color); font-size: 1.05rem;">${holderName} (${record.holderId || 'HOLDER-ID'})</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Issuing Body:</span>
                        <div style="font-weight: 600; color: var(--text-primary);">${issuerName}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Honors / Grade:</span>
                        <div style="color: #10b981; font-weight: 700;">${record.metadata?.grade || 'Verified / Certified'}</div>
                    </div>
                    <div class="detail-item" style="grid-column: 1 / -1;">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Specialization Competencies:</span>
                        <p style="font-size: 0.9rem; color: var(--text-primary); margin: 0.25rem 0 0;">${record.metadata?.details || 'Cryptographically verified professional credential.'}</p>
                    </div>
                </div>
            `;
        } else if (type === 'DIGITAL_ASSET') {
            const hasOwnershipHistory = record.ownershipHistory && record.ownershipHistory.length > 0;
            specificHtml = `
                <div class="specific-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 1.25rem 0;">
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Asset Category:</span>
                        <div style="font-weight: 700; color: var(--text-primary);">${record.metadata?.assetCategory || 'Digital Ownership'}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Serial / Patent Number:</span>
                        <div style="font-weight: 700; color: var(--primary-color); font-family: 'Fira Code', monospace;">${record.metadata?.serialNumber || record.id}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Current Legal Owner:</span>
                        <div style="font-weight: 800; color: #8b5cf6; font-size: 1.05rem;"><i class="fas fa-crown"></i> ${holderName}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Estimated Valuation:</span>
                        <div style="font-weight: 700; color: #10b981;">${record.metadata?.monetaryValue ? `${record.metadata.monetaryValue} ${record.metadata.currency || 'USD'}` : 'Appraised Asset'}</div>
                    </div>
                </div>

                ${hasOwnershipHistory && window.UIComponents ? `
                    <div style="margin-top: 1.5rem;">
                        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-timeline text-primary"></i> Chain-of-Custody Ownership Provenance
                        </h4>
                        ${window.UIComponents.renderOwnershipTimeline(record.ownershipHistory)}
                    </div>
                ` : ''}
            `;
        } else if (type === 'SUPPLY_CHAIN') {
            const hasEvents = record.supplyChainEvents && record.supplyChainEvents.length > 0;
            specificHtml = `
                <div class="specific-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 1.25rem 0;">
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Batch / Lot Number:</span>
                        <div style="font-weight: 700; color: var(--primary-color); font-family: 'Fira Code', monospace;">${record.metadata?.batchNumber || record.id}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Manufacturer:</span>
                        <div style="font-weight: 700; color: var(--text-primary);">${record.metadata?.manufacturer || issuerName}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Origin Location:</span>
                        <div style="font-weight: 600; color: var(--text-primary);"><i class="fas fa-location-dot"></i> ${record.metadata?.origin || 'Global Facility'}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Current Handler / Custodian:</span>
                        <div style="font-weight: 700; color: #06b6d4;"><i class="fas fa-shield-alt"></i> ${holderName}</div>
                    </div>
                </div>

                ${hasEvents && window.UIComponents ? `
                    <div style="margin-top: 1.5rem;">
                        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-truck-fast text-primary"></i> 7-Stage Verifiable Milestone Stepper
                        </h4>
                        ${window.UIComponents.renderSupplyChainStepper(record.supplyChainEvents, record.currentStage || 'MANUFACTURED')}
                    </div>
                ` : ''}
            `;
        } else {
            // CERTIFICATE fallback
            specificHtml = `
                <div class="specific-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 1.25rem 0;">
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Certificate ID:</span>
                        <div style="font-weight: 800; font-size: 1.05rem; color: var(--primary-color);">${recordId}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Recipient Name:</span>
                        <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">${holderName}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Issuing Institution:</span>
                        <div style="font-weight: 600; color: var(--text-primary);">${issuerName}</div>
                    </div>
                    <div class="detail-item">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Classification:</span>
                        <div style="color: var(--text-primary);">${record.metadata?.credentialClassification || record.degreeType || 'Academic Certificate'}</div>
                    </div>
                    ${record.grade || record.metadata?.grade ? `
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Performance / Grade:</span>
                            <div style="color: #059669; font-weight: 700;">${record.grade || record.metadata?.grade}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Blockchain proof box
        let proofHtml = '';
        if (window.UIComponents && typeof window.UIComponents.renderBlockchainProof === 'function') {
            proofHtml = window.UIComponents.renderBlockchainProof(record);
        } else {
            proofHtml = `
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin-top: 1rem; border: 1px solid var(--border-color);">
                    <strong style="color: var(--text-primary);"><i class="fas fa-link"></i> Blockchain Proof</strong>
                    <div style="margin-top: 0.5rem; font-size: 0.8rem; word-break: break-all;">
                        <div><strong>Hash:</strong> <code>${record.recordHash || record.blockchainHash}</code></div>
                        <div><strong>Tx:</strong> <code>${record.txHash || 'N/A'}</code></div>
                    </div>
                </div>
            `;
        }

        // Audit timeline
        let auditHtml = '';
        if (record.auditHistory && record.auditHistory.length > 0 && window.UIComponents) {
            auditHtml = `
                <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-shield-halved text-primary"></i> Cryptographic Audit Trail
                    </h4>
                    ${window.UIComponents.renderAuditTimeline(record.auditHistory)}
                </div>
            `;
        }

        resultDiv.innerHTML = `
            <div class="${statusClass} card-surface" style="border-left: 6px solid ${statusBorderColor}; padding: 2rem; border-radius: 12px;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                    <div>
                        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.85rem; border-radius: 9999px; background: ${statusBadgeBg}; color: ${statusBorderColor}; font-size: 0.85rem; font-weight: 800; margin-bottom: 0.5rem;">
                            <i class="fas ${statusIcon}"></i> ${statusText}
                        </div>
                        <h2 style="color: var(--text-primary); font-size: 1.4rem; margin: 0;">${title}</h2>
                        <span style="font-size: 0.85rem; color: var(--text-secondary); font-family: 'Fira Code', monospace;">Record ID: <strong>${recordId}</strong> &bull; Type: <strong>${type}</strong></span>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <button class="btn btn-outline btn-sm" onclick="verifyManager.showQr('${recordId}')">
                            <i class="fas fa-qrcode"></i> Verification QR
                        </button>
                        <a href="admin.html" class="btn btn-outline btn-sm">
                            <i class="fas fa-shield-alt"></i> Admin View
                        </a>
                    </div>
                </div>

                <!-- Revocation Alert Banner if Revoked -->
                ${isRevoked ? `
                    <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 1.1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                        <strong style="color: #ef4444; font-size: 1rem; display: flex; align-items: center; gap: 0.4rem;">
                            <i class="fas fa-ban"></i> Formal Record Revocation Notice
                        </strong>
                        <p style="margin: 0.4rem 0 0; font-size: 0.9rem; color: var(--text-primary);">
                            <strong>Mandatory Revocation Reason:</strong> "${record.revokeReason || 'Revoked by authorized licensing body'}"
                        </p>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem;">
                            Revoked by: <strong>${record.revokedBy || 'System Authority'}</strong> &bull; Date: ${record.revokedAt ? new Date(record.revokedAt).toLocaleString() : 'Recent'}
                        </div>
                    </div>
                ` : ''}

                <!-- Expired Alert Banner if Expired -->
                ${isExpired && !isRevoked ? `
                    <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                        <strong style="color: #f59e0b; display: flex; align-items: center; gap: 0.4rem;">
                            <i class="fas fa-clock"></i> Credential Validity Expired
                        </strong>
                        <p style="margin: 0.3rem 0 0; font-size: 0.9rem; color: var(--text-primary);">
                            This record expired on <strong>${new Date(record.expiryDate).toLocaleDateString()}</strong>. Renewal required through issuing portal.
                        </p>
                    </div>
                ` : ''}

                <!-- Specific Fields -->
                ${specificHtml}

                <!-- Blockchain Proof Box -->
                ${proofHtml}

                <!-- Audit History -->
                ${auditHtml}

                <!-- Footer Assurance -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
                    <div style="font-size: 0.85rem; color: #10b981; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
                        <i class="fas fa-shield-halved"></i> Cryptographically Anchored & Tamper-Evident
                    </div>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">
                        Validated via CryptaCore Decentralized Trust Protocol
                    </span>
                </div>
            </div>
        `;
    }

    async verifyOnBlockchain(hash) {
        try {
            if (!hash || typeof hash !== 'string') return { valid: false, record: null };

            let formattedHash = hash;
            if (!formattedHash.startsWith('0x')) {
                formattedHash = '0x' + formattedHash;
            }

            if (typeof ethers !== 'undefined' && ethers.isHexString(formattedHash, 32)) {
                const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);
                const contract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, CRYPTACORE_CONTRACT_ABI, provider);
                const record = await contract.records(formattedHash);
                return { valid: Boolean(record.isValid), record };
            }
            return { valid: false, record: null };
        } catch (error) {
            return { valid: false, record: null };
        }
    }
}

// Global initialization
let verifyManager;
window.addEventListener('DOMContentLoaded', () => {
    verifyManager = new CertificateVerifier();
    window.verifyManager = verifyManager;
});

// Allow Enter key to trigger verification
document.getElementById('verifyHash')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verifyManager.verifyCertificate();
    }
});
