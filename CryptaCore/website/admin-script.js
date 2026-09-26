/**
 * CryptaCore - Certificate Authority & Admin Console Engine
 * Comprehensive client-side Web3, Cryptography, and Credential Management
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================
const BLOCKCHAIN_CONFIG = {
    rpcUrl: 'http://127.0.0.1:7545',
    chainId: 1337,
    sepoliaChainId: 11155111,
    contractAddress: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666',
    storageKey: 'cryptacore_certificates_registry_v2',
};

const CRYPTACORE_ABI = [
    'function registerRecord(bytes32 _recordHash, address _recordOwner, string _recordType, string _ipfsHash) returns (bool)',
    'function verifyRecord(bytes32 _recordHash) view returns (bool)',
    'function revokeRecord(bytes32 _recordHash) returns (bool)',
    'function transferRecord(bytes32 _recordHash, address _newOwner, string _reason) returns (bool)',
    'function recordCount() view returns (uint256)',
    'function getRecord(bytes32 _recordHash) view returns (tuple(bytes32 recordHash, address issuer, address recordOwner, uint256 timestamp, string recordType, string ipfsHash, uint256 blockNumber, bool isValid))'
];

// Default initial sample records for immediate rich demonstration
const DEFAULT_SAMPLE_RECORDS = [
    {
        id: 'CC-2026-7842',
        holderName: 'Alex Morgan',
        recipientEmail: 'alex.morgan@university.edu',
        recipientWallet: '0x71C8364f3B7283A390638148bA4204c3e80F8d0A',
        issuerName: 'CryptaCore Institute of Technology',
        department: 'Department of Computer Science & Cybersecurity',
        credentialTitle: 'Bachelor of Technology in Blockchain Systems',
        credentialType: "Bachelor's Degree",
        issueDate: '2026-08-15',
        expiryDate: '',
        grade: 'Grade A+ / 3.96 GPA (First Class with Distinction)',
        details: 'Major in Smart Contract Auditing and Distributed Systems. Capstone on Zero-Knowledge Proofs.',
        ipfsHash: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        fileHash: '0x3a7b9c1d5e8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d',
        blockchainHash: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666a7b9c1d5e8f2a4b6c8e0f1a3',
        txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
        blockNumber: 6841920,
        network: 'Sepolia (Simulated)',
        status: 'valid',
        registeredAt: '2026-08-15T10:30:00.000Z'
    },
    {
        id: 'CC-2026-9014',
        holderName: 'Elena Rostova',
        recipientEmail: 'elena.rostova@mit.edu',
        recipientWallet: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        issuerName: 'MIT Center for Digital Currency',
        department: 'Graduate School of Engineering',
        credentialTitle: 'Master of Science in Cryptographic Engineering',
        credentialType: "Master's Degree",
        issueDate: '2026-06-20',
        expiryDate: '',
        grade: 'Grade A / 4.0 GPA (Summa Cum Laude)',
        details: 'Specialization in Post-Quantum Cryptography & Consensus Mechanisms.',
        ipfsHash: 'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedfdewifuqw7c2vxy3mbb5q',
        fileHash: '0x5e8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d',
        blockchainHash: '0x8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e',
        txHash: '0x4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b',
        blockNumber: 6839410,
        network: 'Sepolia (Simulated)',
        status: 'valid',
        registeredAt: '2026-06-20T14:15:00.000Z'
    },
    {
        id: 'CC-2026-6120',
        holderName: 'Devon Takahashi',
        recipientEmail: 'devon.t@securityaudits.io',
        recipientWallet: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        issuerName: 'Ethereum Security Council',
        department: 'Smart Contract Defense Certification Board',
        credentialTitle: 'Certified Lead Smart Contract Security Auditor',
        credentialType: 'Professional Certification',
        issueDate: '2025-01-10',
        expiryDate: '2026-01-10',
        grade: 'Score: 98/100 (Master Auditor)',
        details: 'Covers EVM bytecode analysis, reentrancy vectors, DeFi economic exploits, and formal verification.',
        ipfsHash: 'ipfs://bafybeifx7vyx3i7k6e4s5j8m9q2w1e3r4t5y6u7i8o9p0a1s2d3f4g5h6j',
        fileHash: '0x2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a4b6c8e0f1a3b5d7e9f',
        blockchainHash: '0x7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a4b6c8e0f1a3b5d',
        txHash: '0x1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b4a3f2e',
        blockNumber: 6812004,
        network: 'Sepolia (Simulated)',
        status: 'expired',
        registeredAt: '2025-01-10T09:00:00.000Z'
    }
];

// ============================================================================
// CRYPTOGRAPHIC & UTILITY HELPERS
// ============================================================================
class CryptoUtil {
    /**
     * Compute NIST Standard SHA-256 hex string from an ArrayBuffer using native Web Crypto
     */
    static async sha256Buffer(buffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Compute SHA-512 hex string from an ArrayBuffer
     */
    static async sha512Buffer(buffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-512', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Compute EVM-compatible Keccak-256 hash
     */
    static async keccak256Buffer(buffer) {
        if (typeof ethers !== 'undefined' && ethers.keccak256) {
            return ethers.keccak256(new Uint8Array(buffer));
        }
        return await this.sha256Buffer(buffer);
    }

    /**
     * Calculate 32-bit Cyclic Redundancy Check (CRC32)
     */
    static crc32(buffer) {
        const bytes = new Uint8Array(buffer);
        let crc = 0 ^ (-1);
        for (let i = 0; i < bytes.length; i++) {
            crc = (crc >>> 8) ^ CryptoUtil._crcTable[(crc ^ bytes[i]) & 0xFF];
        }
        return '0x' + ((crc ^ (-1)) >>> 0).toString(16).padStart(8, '0').toUpperCase();
    }

    static _crcTable = (() => {
        let c;
        const table = [];
        for (let n = 0; n < 256; n++) {
            c = n;
            for (let k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            table[n] = c;
        }
        return table;
    })();

    /**
     * Compute SHA-256 hex string from text
     */
    static async sha256Text(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        return await this.sha256Buffer(data);
    }

    /**
     * Generate a deterministic or random mock blockchain address
     */
    static randomAddress() {
        const chars = '0123456789abcdef';
        let addr = '0x';
        for (let i = 0; i < 40; i++) {
            addr += chars[Math.floor(Math.random() * chars.length)];
        }
        return addr;
    }

    /**
     * Generate simulated IPFS CID v1
     */
    static generateIpfsCid() {
        const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        return `ipfs://bafybei${randomHex.substring(0, 30)}`;
    }

    /**
     * Generate unique Certificate ID
     */
    static generateCertId() {
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `CC-${year}-${rand}`;
    }

    /**
     * Simple Merkle Root derivation for an array of hex hashes
     */
    static async calculateMerkleRoot(hashList) {
        if (!hashList || hashList.length === 0) {
            return '0x0000000000000000000000000000000000000000000000000000000000000000';
        }
        let currentLevel = [...hashList];
        while (currentLevel.length > 1) {
            const nextLevel = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = (i + 1 < currentLevel.length) ? currentLevel[i + 1] : left;
                const combined = left + right.replace('0x', '');
                const parentHash = await this.sha256Text(combined);
                nextLevel.push(parentHash);
            }
            currentLevel = nextLevel;
        }
        return currentLevel[0];
    }
}

// ============================================================================
// TOAST NOTIFICATIONS MANAGER
// ============================================================================
class ToastManager {
    static show(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

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
            <div class="toast-content">${message}</div>
            <button class="toast-close" type="button">&times;</button>
        `;

        toast.querySelector('.toast-close').onclick = () => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
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

// ============================================================================
// MAIN CERTIFICATE AUTHORITY MANAGER CLASS
// ============================================================================
class CertificateAuthorityManager {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.userAddress = null;
        this.isWalletConnected = false;
        this.currentNetwork = 'demo';
        
        this.uploadedFile = null;
        this.uploadedFileHash = null;
        this.qrCodeInstance = null;
        this.receiptQrInstance = null;
        this.batchParsedRecords = [];
        this.currentRevokeRecordId = null;

        this.records = this.loadRecords();

        this.init();
    }

    init() {
        this.setupTheme();
        this.setupTabs();
        this.setupWallet();
        this.setupSingleIssuanceForm();
        this.setupLivePreviewListeners();
        this.setupBatchUpload();
        this.setupRegistryLedger();
        this.setupModals();
        
        // Extended Modules & RBAC Setup
        this.setupRBAC();
        this.setupOverviewDashboard();
        this.setupLicensePortal();
        this.setupCredentialPortal();
        this.setupOwnershipPortal();
        this.setupSupplyChainPortal();
        this.setupUniversalModals();

        // Initial live rendering
        this.updateStats();
        this.renderRegistryTable();
        this.renderOverviewDashboard();
        this.renderLicenseTable();
        this.renderCredentialTable();
        this.renderOwnershipTable();
        this.renderSupplyChainTable();
        this.updateLiveCertificatePreview();
        this.setInitialDates();
    }

    // ========================================================================
    // THEME & NAVIGATION
    // ========================================================================
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            themeToggle?.classList.add('active');
            const icon = themeToggle?.querySelector('i');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            themeToggle?.classList.remove('active');
            const icon = themeToggle?.querySelector('i');
            if (icon) icon.className = 'fas fa-moon';
        }

        themeToggle?.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode', !isDark);
            themeToggle?.classList.toggle('active', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            const icon = themeToggle?.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            ToastManager.show(`Switched to ${isDark ? 'Dark' : 'Light'} theme`, 'info', 2000);
        });

        hamburger?.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
        });
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.admin-tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTabId = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const targetContent = document.getElementById(targetTabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                if (targetTabId === 'overview-tab') this.renderOverviewDashboard();
                if (targetTabId === 'licenses-tab') this.renderLicenseTable();
                if (targetTabId === 'credentials-tab') this.renderCredentialTable();
                if (targetTabId === 'ownership-tab') this.renderOwnershipTable();
                if (targetTabId === 'supply-chain-tab') this.renderSupplyChainTable();
                if (targetTabId === 'registry-tab') this.renderRegistryTable();
            });
        });

        // Global helper for switching tabs from anywhere
        window.switchAdminTab = (targetTabId) => {
            const btn = document.querySelector(`.tab-btn[data-tab="${targetTabId}"]`);
            if (btn) btn.click();
        };
    }

    setInitialDates() {
        const issueDateInput = document.getElementById('issueDateInput');
        if (issueDateInput && !issueDateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            issueDateInput.value = today;
        }

        const studentIdInput = document.getElementById('studentIdInput');
        if (studentIdInput && !studentIdInput.value) {
            studentIdInput.value = CryptoUtil.generateCertId();
        }

        const ipfsInput = document.getElementById('ipfsUriInput');
        if (ipfsInput && !ipfsInput.value) {
            ipfsInput.value = CryptoUtil.generateIpfsCid();
        }
    }

    // ========================================================================
    // WALLET & BLOCKCHAIN CONNECTION
    // ========================================================================
    setupWallet() {
        const connectBtn = document.getElementById('connectWalletBtn');
        const pill = document.getElementById('walletStatusPill');

        connectBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.connectMetaMask();
        });

        pill?.addEventListener('click', () => {
            if (!this.isWalletConnected) {
                this.connectMetaMask();
            }
        });

        // Contract Address click to copy
        const contractBadge = document.getElementById('contractAddressBadge');
        contractBadge?.addEventListener('click', () => {
            navigator.clipboard.writeText(BLOCKCHAIN_CONFIG.contractAddress);
            ToastManager.show('Smart Contract Address copied to clipboard!', 'success', 2500);
        });

        // Check if MetaMask already authorized
        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    this.handleWalletConnected(accounts[0]);
                } else {
                    this.handleWalletDisconnected();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }

    async connectMetaMask() {
        if (typeof window === 'undefined' || !window.ethereum) {
            ToastManager.show('MetaMask is not installed. Running in Demo Simulation Mode.', 'warning', 4000);
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            if (accounts && accounts.length > 0) {
                this.provider = provider;
                this.signer = await provider.getSigner();
                this.userAddress = accounts[0];
                const network = await provider.getNetwork();

                this.handleWalletConnected(accounts[0], Number(network.chainId));
                ToastManager.show(`Wallet Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`, 'success', 3000);
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            ToastManager.show('Wallet connection rejected. Continuing in Demo Mode.', 'warning', 3000);
        }
    }

    handleWalletConnected(account, chainId = null) {
        this.isWalletConnected = true;
        this.userAddress = account;

        const dot = document.getElementById('walletStatusDot');
        const text = document.getElementById('walletStatusText');
        const btn = document.getElementById('connectWalletBtn');
        const networkBadge = document.getElementById('networkNameText');

        if (dot) {
            dot.className = 'status-dot connected';
        }
        if (text) {
            text.textContent = `${account.substring(0, 6)}...${account.substring(38)}`;
        }
        if (btn) {
            btn.textContent = 'Connected';
            btn.classList.add('btn-connected');
        }

        if (chainId) {
            const chainName = chainId === 1337 ? 'Ganache (1337)' : chainId === 11155111 ? 'Sepolia Testnet' : `Chain ID ${chainId}`;
            if (networkBadge) {
                networkBadge.textContent = `Network: ${chainName}`;
            }
        }

        // Initialize contract with signer
        if (this.signer && BLOCKCHAIN_CONFIG.contractAddress) {
            this.contract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, CRYPTACORE_ABI, this.signer);
        }
    }

    handleWalletDisconnected() {
        this.isWalletConnected = false;
        this.userAddress = null;
        this.signer = null;
        this.contract = null;

        const dot = document.getElementById('walletStatusDot');
        const text = document.getElementById('walletStatusText');
        const btn = document.getElementById('connectWalletBtn');

        if (dot) dot.className = 'status-dot disconnected';
        if (text) text.textContent = 'Demo Mode';
        if (btn) {
            btn.textContent = 'Connect Wallet';
            btn.classList.remove('btn-connected');
        }
    }

    // ========================================================================
    // SINGLE CERTIFICATE ISSUANCE & FILE DROPZONE
    // ========================================================================
    setupSingleIssuanceForm() {
        const dropzone = document.getElementById('fileDropzone');
        const fileInput = document.getElementById('certFileInput');
        const btnRemoveFile = document.getElementById('btnRemoveFile');
        const btnGenCertId = document.getElementById('btnGenCertId');
        const btnRefreshIpfs = document.getElementById('btnRefreshIpfs');
        const btnFillSample = document.getElementById('btnFillSampleData');
        const btnResetForm = document.getElementById('btnResetForm');
        const noExpiryCheckbox = document.getElementById('noExpiryCheckbox');
        const expiryDateInput = document.getElementById('expiryDateInput');
        const form = document.getElementById('certificateIssuanceForm');

        // Drag and drop events
        dropzone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone?.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone?.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                await this.handleFileSelection(e.dataTransfer.files[0]);
            }
        });

        dropzone?.addEventListener('click', (e) => {
            if (e.target !== btnRemoveFile && !btnRemoveFile?.contains(e.target)) {
                fileInput?.click();
            }
        });

        fileInput?.addEventListener('change', async () => {
            if (fileInput.files.length > 0) {
                await this.handleFileSelection(fileInput.files[0]);
            }
        });

        btnRemoveFile?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearSelectedFile();
        });

        // Quick action buttons
        btnGenCertId?.addEventListener('click', () => {
            const newId = CryptoUtil.generateCertId();
            document.getElementById('studentIdInput').value = newId;
            this.updateLiveCertificatePreview();
            ToastManager.show(`Generated Certificate ID: ${newId}`, 'info', 2000);
        });

        const btnGenWallet = document.getElementById('btnGenWallet');
        btnGenWallet?.addEventListener('click', () => {
            const newWallet = CryptoUtil.randomAddress();
            document.getElementById('recipientWalletInput').value = newWallet;
            ToastManager.show(`Generated Web3 Wallet Address: ${newWallet.substring(0, 10)}...`, 'info', 2000);
        });

        btnRefreshIpfs?.addEventListener('click', () => {
            const newIpfs = CryptoUtil.generateIpfsCid();
            document.getElementById('ipfsUriInput').value = newIpfs;
            ToastManager.show('Generated new decentralized IPFS CID', 'info', 2000);
        });

        // Copy computed SHA-256 hash
        const btnCopyHash = document.getElementById('btnCopyFileHash');
        btnCopyHash?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.uploadedFileHash) {
                navigator.clipboard.writeText(this.uploadedFileHash);
                ToastManager.show('SHA-256 Hash copied to clipboard!', 'success', 2500);
            }
        });

        // Checksum Integrity Matcher
        const btnVerifyChecksum = document.getElementById('btnVerifyChecksum');
        btnVerifyChecksum?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.verifyChecksumMatcher();
        });

        const expectedHashInput = document.getElementById('expectedHashInput');
        expectedHashInput?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.verifyChecksumMatcher();
            }
        });

        btnFillSample?.addEventListener('click', () => {
            this.fillSampleData();
        });

        btnResetForm?.addEventListener('click', () => {
            form.reset();
            this.clearSelectedFile();
            this.setInitialDates();
            this.updateLiveCertificatePreview();
            ToastManager.show('Form cleared', 'info', 2000);
        });

        noExpiryCheckbox?.addEventListener('change', () => {
            if (noExpiryCheckbox.checked) {
                expiryDateInput.value = '';
                expiryDateInput.disabled = true;
            } else {
                expiryDateInput.disabled = false;
            }
            this.updateLiveCertificatePreview();
        });

        // Form submission
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSingleMintSubmit();
        });
    }

    async handleFileSelection(file) {
        if (!file) return;

        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|png|jpg|jpeg|webp)$/i)) {
            ToastManager.show('Please upload a valid PDF or Image file (PNG, JPG, WEBP).', 'error', 3500);
            return;
        }

        this.uploadedFile = file;
        
        // High-precision benchmark start
        const t0 = performance.now();

        // Read file buffer
        const buffer = await file.arrayBuffer();

        // Compute SHA-256 hash using native Web Crypto API (SubtleCrypto)
        this.uploadedFileHash = await CryptoUtil.sha256Buffer(buffer);
        
        // Compute auxiliary hashes (Keccak-256 & CRC-32)
        const keccakHash = await CryptoUtil.keccak256Buffer(buffer);
        const crcHash = CryptoUtil.crc32(buffer);

        const calcTimeMs = (performance.now() - t0).toFixed(2);

        // Update UI Elements
        const dropzoneContent = document.getElementById('dropzoneContent');
        const filePreviewCard = document.getElementById('filePreviewCard');
        const previewFileName = document.getElementById('previewFileName');
        const previewFileMeta = document.getElementById('previewFileMeta');
        const previewFileHashFull = document.getElementById('previewFileHashFull');
        const previewKeccakHash = document.getElementById('previewKeccakHash');
        const previewCrcHash = document.getElementById('previewCrcHash');
        const hashCalcTimeText = document.getElementById('hashCalcTimeText');
        const previewIcon = document.getElementById('filePreviewTypeIcon');
        const checksumResultAlert = document.getElementById('checksumResultAlert');

        if (dropzoneContent) dropzoneContent.style.display = 'none';
        if (filePreviewCard) filePreviewCard.style.display = 'flex';

        if (previewFileName) previewFileName.textContent = file.name;
        if (previewFileMeta) {
            const sizeFormattedMb = (file.size / (1024 * 1024)).toFixed(2);
            const sizeBytes = file.size.toLocaleString();
            previewFileMeta.textContent = `${sizeFormattedMb} MB • ${file.type || 'Document'} • ${sizeBytes} bytes`;
        }

        if (previewFileHashFull) {
            previewFileHashFull.textContent = this.uploadedFileHash;
        }

        if (previewKeccakHash) {
            previewKeccakHash.textContent = `${keccakHash.substring(0, 10)}...${keccakHash.substring(58)}`;
            previewKeccakHash.title = keccakHash;
        }

        if (previewCrcHash) {
            previewCrcHash.textContent = crcHash;
        }

        if (hashCalcTimeText) {
            hashCalcTimeText.innerHTML = `<i class="fas fa-stopwatch"></i> Calculated in ${calcTimeMs} ms`;
        }

        if (previewIcon) {
            previewIcon.className = file.type === 'application/pdf' ? 'fas fa-file-pdf text-danger' : 'fas fa-file-image text-primary';
        }

        if (checksumResultAlert) {
            checksumResultAlert.style.display = 'none';
        }

        ToastManager.show(`SHA-256 Computed in ${calcTimeMs}ms: ${this.uploadedFileHash.substring(0, 14)}...`, 'success', 3500);
    }

    verifyChecksumMatcher() {
        if (!this.uploadedFileHash) {
            ToastManager.show('Please upload a file first to verify checksum.', 'warning', 3000);
            return;
        }

        const input = document.getElementById('expectedHashInput');
        const alertBox = document.getElementById('checksumResultAlert');
        if (!input || !alertBox) return;

        const expected = input.value.trim().toLowerCase().replace(/^0x/, '');
        const actual = this.uploadedFileHash.toLowerCase().replace(/^0x/, '');

        if (!expected) {
            ToastManager.show('Please enter or paste an expected SHA-256 hash.', 'info', 2500);
            return;
        }

        alertBox.style.display = 'block';

        if (expected === actual) {
            alertBox.className = 'matcher-result alert-success';
            alertBox.innerHTML = `
                <div class="result-icon"><i class="fas fa-shield-check"></i></div>
                <div class="result-body">
                    <strong>INTEGRITY VERIFIED: BIT-PERFECT MATCH</strong>
                    <p>The uploaded document's SHA-256 matches the expected digest exactly. 0% content corruption or unauthorized tampering detected.</p>
                </div>
            `;
            ToastManager.show('Checksum match! File integrity 100% verified.', 'success', 3000);
        } else {
            alertBox.className = 'matcher-result alert-danger';
            alertBox.innerHTML = `
                <div class="result-icon"><i class="fas fa-triangle-exclamation"></i></div>
                <div class="result-body">
                    <strong>CHECKSUM MISMATCH: TAMPER DETECTED</strong>
                    <p>The uploaded document's SHA-256 does NOT match the expected value. The file content, metadata, or formatting has been altered.</p>
                    <div class="hash-diff">
                        <div><span>Computed:</span> <code>0x${actual.substring(0, 16)}...</code></div>
                        <div><span>Expected:</span> <code>0x${expected.substring(0, 16)}...</code></div>
                    </div>
                </div>
            `;
            ToastManager.show('Checksum mismatch! Document has been modified or corrupted.', 'error', 4000);
        }
    }

    clearSelectedFile() {
        this.uploadedFile = null;
        this.uploadedFileHash = null;

        const fileInput = document.getElementById('certFileInput');
        if (fileInput) fileInput.value = '';

        const dropzoneContent = document.getElementById('dropzoneContent');
        const filePreviewCard = document.getElementById('filePreviewCard');
        const expectedHashInput = document.getElementById('expectedHashInput');
        const checksumResultAlert = document.getElementById('checksumResultAlert');

        if (dropzoneContent) dropzoneContent.style.display = 'flex';
        if (filePreviewCard) filePreviewCard.style.display = 'none';
        if (expectedHashInput) expectedHashInput.value = '';
        if (checksumResultAlert) checksumResultAlert.style.display = 'none';
    }

    fillSampleData() {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val;
        };

        setVal('namePrefixSelect', 'Eng.');
        setVal('holderNameInput', 'Alexandra Chen');
        setVal('studentRollInput', '2022-BCS-089');
        setVal('studentIdInput', CryptoUtil.generateCertId());
        setVal('recipientEmailInput', 'alexandra.chen@polytechnic.edu');
        setVal('recipientWalletInput', CryptoUtil.randomAddress());
        setVal('issuerNameInput', 'CryptaCore Institute of Technology');
        setVal('accreditationInput', 'NAAC A++ • AICTE • W3C Verified');
        setVal('departmentInput', 'Faculty of Blockchain Engineering & Decentralized AI');
        setVal('cohortYearInput', '2022 - 2026 Batch');
        setVal('credentialTitleInput', 'Master of Science in Smart Contract Architecture');
        setVal('credentialTypeSelect', "Master's Degree");
        setVal('gradeInput', 'Grade A+ / 3.98 CGPA');
        setVal('honorsInput', 'First Class with Distinction');
        setVal('signatory1Input', 'Dr. Julian Vance - Dean of Academic Affairs');
        setVal('signatory2Input', 'Prof. Sarah Jenkins - Vice Chancellor');
        setVal('additionalDetailsInput', 'Thesis: Scalable Verifiable Credentials Using Zero-Knowledge State Channels.');
        
        const noExpiry = document.getElementById('noExpiryCheckbox');
        if (noExpiry) noExpiry.checked = true;
        const expiryInput = document.getElementById('expiryDateInput');
        if (expiryInput) {
            expiryInput.value = '';
            expiryInput.disabled = true;
        }

        this.updateLiveCertificatePreview();
        ToastManager.show('Sample student certificate data filled!', 'success', 2500);
    }

    // ========================================================================
    // LIVE DYNAMIC CERTIFICATE VISUAL PREVIEW & EXPORT
    // ========================================================================
    setupLivePreviewListeners() {
        const watchedInputs = [
            'namePrefixSelect', 'holderNameInput', 'studentRollInput', 'studentIdInput',
            'issuerNameInput', 'accreditationInput', 'departmentInput', 'cohortYearInput',
            'credentialTitleInput', 'credentialTypeSelect', 'issueDateInput', 'gradeInput',
            'honorsInput', 'sealStyleSelect', 'signatory1Input', 'signatory2Input'
        ];

        watchedInputs.forEach(id => {
            const el = document.getElementById(id);
            el?.addEventListener('input', () => this.updateLiveCertificatePreview());
            el?.addEventListener('change', () => this.updateLiveCertificatePreview());
        });

        // Theme selector for the certificate render card
        const themeSelect = document.getElementById('certThemeSelect');
        const certCard = document.getElementById('certificateRenderCard');
        themeSelect?.addEventListener('change', () => {
            if (certCard) {
                certCard.className = `certificate-render-card ${themeSelect.value}`;
            }
        });

        // Preview toolbar actions
        const btnDownloadPng = document.getElementById('btnDownloadCertPng');
        btnDownloadPng?.addEventListener('click', () => this.downloadCertificatePng());

        const btnPrint = document.getElementById('btnPrintCert');
        btnPrint?.addEventListener('click', () => {
            window.print();
        });
    }

    updateLiveCertificatePreview() {
        const prefix = document.getElementById('namePrefixSelect')?.value || '';
        const rawName = document.getElementById('holderNameInput')?.value.trim() || 'Alex Morgan';
        const fullName = prefix ? `${prefix} ${rawName}` : rawName;
        const rollNo = document.getElementById('studentRollInput')?.value.trim() || '';
        const studentId = document.getElementById('studentIdInput')?.value.trim() || 'CC-2026-7842';
        const issuerName = document.getElementById('issuerNameInput')?.value.trim() || 'CRYPTACORE INSTITUTE OF TECHNOLOGY';
        const accreditation = document.getElementById('accreditationInput')?.value.trim() || '';
        const department = document.getElementById('departmentInput')?.value.trim() || 'Department of Computer Science & Cybersecurity';
        const degreeTitle = document.getElementById('credentialTitleInput')?.value.trim() || 'Bachelor of Technology in Blockchain Systems';
        const degreeType = document.getElementById('credentialTypeSelect')?.value || "Bachelor's Degree";
        const issueDate = document.getElementById('issueDateInput')?.value || new Date().toISOString().split('T')[0];
        const grade = document.getElementById('gradeInput')?.value.trim() || '';
        const honors = document.getElementById('honorsInput')?.value.trim() || '';
        const sig1 = document.getElementById('signatory1Input')?.value.trim() || 'Dr. Julian Vance - Dean of Academic Affairs';
        const sealStyle = document.getElementById('sealStyleSelect')?.value || 'seal-gold';

        // DOM elements
        const previewIssuer = document.getElementById('previewIssuerText');
        const previewDept = document.getElementById('previewDeptText');
        const previewAccred = document.getElementById('previewAccreditationText');
        const previewType = document.getElementById('previewTypeTag');
        const previewRecipient = document.getElementById('previewRecipientText');
        const previewRollContainer = document.getElementById('previewRollContainer');
        const previewRollText = document.getElementById('previewRollText');
        const previewDegree = document.getElementById('previewDegreeText');
        const previewGradeContainer = document.getElementById('previewGradeContainer');
        const previewGradeText = document.getElementById('previewGradeText');
        const previewHonorsContainer = document.getElementById('previewHonorsContainer');
        const previewHonorsText = document.getElementById('previewHonorsText');
        const previewSig1Name = document.getElementById('previewSig1Name');
        const previewSig1Title = document.getElementById('previewSig1Title');
        const previewSeal = document.getElementById('previewSealElement');
        const previewIssueDate = document.getElementById('previewIssueDateText');
        const previewCertId = document.getElementById('previewCertIdText');

        if (previewIssuer) previewIssuer.textContent = issuerName.toUpperCase();
        if (previewDept) previewDept.textContent = department;
        
        if (previewAccred) {
            if (accreditation) {
                previewAccred.style.display = 'inline-block';
                previewAccred.textContent = accreditation;
            } else {
                previewAccred.style.display = 'none';
            }
        }

        if (previewType) previewType.textContent = `OFFICIAL ${degreeType.toUpperCase()}`;
        if (previewRecipient) previewRecipient.textContent = fullName;

        if (previewRollContainer && previewRollText) {
            if (rollNo) {
                previewRollContainer.style.display = 'inline-block';
                previewRollText.textContent = `Roll No: ${rollNo}`;
            } else {
                previewRollContainer.style.display = 'none';
            }
        }

        if (previewDegree) previewDegree.textContent = degreeTitle;

        if (previewGradeContainer && previewGradeText) {
            if (grade) {
                previewGradeContainer.style.display = 'inline-block';
                previewGradeText.textContent = `Grade: ${grade}`;
            } else {
                previewGradeContainer.style.display = 'none';
            }
        }

        if (previewHonorsContainer && previewHonorsText) {
            if (honors) {
                previewHonorsContainer.style.display = 'inline-block';
                previewHonorsText.textContent = honors;
            } else {
                previewHonorsContainer.style.display = 'none';
            }
        }

        if (previewSig1Name && previewSig1Title) {
            const sigParts = sig1.split('-');
            previewSig1Name.textContent = sigParts[0]?.trim() || 'Dr. Julian Vance';
            previewSig1Title.textContent = sigParts[1]?.trim() || 'Dean of Academic Affairs';
        }

        if (previewSeal) {
            previewSeal.className = `cert-gold-seal ${sealStyle}`;
        }

        if (previewIssueDate) {
            const formattedDate = new Date(issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            previewIssueDate.textContent = `Issued: ${formattedDate !== 'Invalid Date' ? formattedDate : issueDate}`;
        }

        if (previewCertId) {
            previewCertId.textContent = `ID: ${studentId}`;
        }

        // Generate Live Embedded QR Code in preview
        this.renderPreviewQrCode(studentId, fullName);
    }

    renderPreviewQrCode(studentId, holderName) {
        const qrBox = document.getElementById('certPreviewQrBox');
        if (!qrBox) return;

        qrBox.innerHTML = '';
        const verifyUrl = `${window.location.origin}/verify.html?holder=${encodeURIComponent(holderName)}&id=${encodeURIComponent(studentId)}`;

        try {
            this.qrCodeInstance = new QRCode(qrBox, {
                text: verifyUrl,
                width: 76,
                height: 76,
                colorDark: '#0f172a',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        } catch (e) {
            console.error('QR generation error:', e);
        }
    }

    async downloadCertificatePng() {
        const prefix = document.getElementById('namePrefixSelect')?.value || '';
        const rawName = document.getElementById('holderNameInput')?.value.trim() || 'Alex Morgan';
        const holderName = prefix ? `${prefix} ${rawName}` : rawName;
        const studentId = document.getElementById('studentIdInput')?.value.trim() || 'CC-2026';
        
        ToastManager.show('Generating high-resolution certificate image...', 'info', 2000);

        const canvas = document.getElementById('hiddenCertCanvas');
        const ctx = canvas.getContext('2d');

        // High-res canvas dimensions (A4 Landscape ratio)
        canvas.width = 1600;
        canvas.height = 1130;

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGrad.addColorStop(0, '#ffffff');
        bgGrad.addColorStop(0.5, '#f8fafc');
        bgGrad.addColorStop(1, '#f1f5f9');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ornate Outer Border (Gold / Tech)
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 14;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

        // Corner ornaments
        ctx.fillStyle = '#d97706';
        const corners = [[50, 50], [canvas.width - 70, 50], [50, canvas.height - 70], [canvas.width - 70, canvas.height - 70]];
        corners.forEach(([x, y]) => {
            ctx.fillRect(x, y, 20, 20);
        });

        // Header: Institution
        const issuerName = (document.getElementById('issuerNameInput')?.value.trim() || 'CRYPTACORE INSTITUTE OF TECHNOLOGY').toUpperCase();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 36px Cinzel, "Playfair Display", serif';
        ctx.textAlign = 'center';
        ctx.fillText(issuerName, canvas.width / 2, 160);

        // Department
        const department = document.getElementById('departmentInput')?.value.trim() || 'Department of Computer Science & Cybersecurity';
        ctx.fillStyle = '#475569';
        ctx.font = '500 20px Inter, sans-serif';
        ctx.fillText(department, canvas.width / 2, 200);

        // Banner
        const credentialType = document.getElementById('credentialTypeSelect')?.value || "Bachelor's Degree";
        ctx.fillStyle = '#2563eb';
        ctx.font = 'bold 24px Montserrat, sans-serif';
        ctx.fillText(`OFFICIAL ${credentialType.toUpperCase()}`, canvas.width / 2, 260);

        // Presented to
        ctx.fillStyle = '#64748b';
        ctx.font = 'italic 22px "Playfair Display", serif';
        ctx.fillText('This is proudly awarded with cryptographic proof to', canvas.width / 2, 330);

        // Recipient Name
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 56px "Playfair Display", serif';
        ctx.fillText(holderName, canvas.width / 2, 420);

        // Underline under name
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 250, 445);
        ctx.lineTo(canvas.width / 2 + 250, 445);
        ctx.stroke();

        // Achievement Text
        ctx.fillStyle = '#475569';
        ctx.font = '20px Inter, sans-serif';
        ctx.fillText('for successful completion of all accredited curriculum requirements in', canvas.width / 2, 510);

        // Degree Title
        const degree = document.getElementById('credentialTitleInput')?.value.trim() || 'Bachelor of Technology in Blockchain Systems';
        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 34px Cinzel, serif';
        ctx.fillText(degree, canvas.width / 2, 570);

        // Grade & Honors
        const grade = document.getElementById('gradeInput')?.value.trim() || '';
        const honors = document.getElementById('honorsInput')?.value.trim() || '';
        const gradeStr = honors ? `${grade ? grade + ' • ' : ''}${honors}` : grade;
        if (gradeStr) {
            ctx.fillStyle = '#059669';
            ctx.font = '600 22px Inter, sans-serif';
            ctx.fillText(gradeStr, canvas.width / 2, 630);
        }

        // Footer: Signatory
        const sig1 = document.getElementById('signatory1Input')?.value.trim() || 'Dr. Julian Vance - Dean of Academic Affairs';
        const sigParts = sig1.split('-');
        const sigName = sigParts[0]?.trim() || 'Dr. Julian Vance';
        const sigTitle = sigParts[1]?.trim() || 'Dean of Academic Affairs';

        ctx.fillStyle = '#0f172a';
        ctx.font = 'italic 28px "Brush Script MT", cursive, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(sigName, 180, 840);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(160, 855);
        ctx.lineTo(420, 855);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '600 16px Inter, sans-serif';
        ctx.fillText(sigTitle, 190, 885);

        const issueDate = document.getElementById('issueDateInput')?.value || new Date().toISOString().split('T')[0];
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(`Issue Date: ${issueDate}`, 190, 910);

        // Footer: Seal
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 850, 60, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CRYPTACORE', canvas.width / 2, 845);
        ctx.fillText('VERIFIED', canvas.width / 2, 865);

        // Footer: Credential ID
        ctx.textAlign = 'right';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px "Fira Code", monospace';
        ctx.fillText(`ID: ${studentId}`, canvas.width - 180, 880);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Blockchain Anchored Record', canvas.width - 180, 905);

        // Download trigger
        const link = document.createElement('a');
        link.download = `CryptaCore-Certificate-${studentId}-${holderName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        ToastManager.show('Certificate PNG downloaded successfully!', 'success', 3000);
    }

    // ========================================================================
    // SINGLE CERTIFICATE MINT & BLOCKCHAIN EXECUTION
    // ========================================================================
    async handleSingleMintSubmit() {
        const prefix = document.getElementById('namePrefixSelect')?.value || '';
        const rawName = document.getElementById('holderNameInput').value.trim();
        const holderName = prefix ? `${prefix} ${rawName}` : rawName;
        const studentRoll = document.getElementById('studentRollInput')?.value.trim() || '';
        const studentId = document.getElementById('studentIdInput').value.trim();
        const recipientEmail = document.getElementById('recipientEmailInput').value.trim();
        const recipientWallet = document.getElementById('recipientWalletInput').value.trim() || CryptoUtil.randomAddress();
        const issuerName = document.getElementById('issuerNameInput').value.trim();
        const accreditation = document.getElementById('accreditationInput')?.value.trim() || '';
        const department = document.getElementById('departmentInput').value.trim();
        const cohortYear = document.getElementById('cohortYearInput')?.value.trim() || '';
        const credentialTitle = document.getElementById('credentialTitleInput').value.trim();
        const credentialType = document.getElementById('credentialTypeSelect').value;
        const issueDate = document.getElementById('issueDateInput').value;
        const noExpiry = document.getElementById('noExpiryCheckbox').checked;
        const expiryDate = noExpiry ? '' : document.getElementById('expiryDateInput').value;
        const grade = document.getElementById('gradeInput').value.trim();
        const honors = document.getElementById('honorsInput')?.value.trim() || '';
        const sealStyle = document.getElementById('sealStyleSelect')?.value || 'seal-gold';
        const signatory1 = document.getElementById('signatory1Input')?.value.trim() || '';
        const signatory2 = document.getElementById('signatory2Input')?.value.trim() || '';
        const details = document.getElementById('additionalDetailsInput').value.trim();
        const targetNetwork = document.getElementById('targetNetworkSelect')?.value || 'sepolia';
        const hashAlgo = document.getElementById('hashAlgorithmSelect')?.value || 'sha256';
        const ipfsHash = document.getElementById('ipfsUriInput').value || CryptoUtil.generateIpfsCid();

        const submitBtn = document.getElementById('btnSubmitMint');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Anchoring to Blockchain...';
        }

        try {
            // Compute File / Credential Hash
            let fileHash = this.uploadedFileHash;
            if (!fileHash) {
                const metadataString = JSON.stringify({ studentId, studentRoll, holderName, credentialTitle, issuerName, issueDate, grade, honors });
                fileHash = await CryptoUtil.sha256Text(metadataString);
            }

            // Derive unique Blockchain Record Hash
            const recordCombined = `${fileHash}_${studentId}_${recipientWallet}_${Date.now()}`;
            const blockchainHash = await CryptoUtil.sha256Text(recordCombined);

            let txHash = null;
            let blockNumber = null;
            let executionMode = `Demo Mode (${targetNetwork.toUpperCase()})`;

            // Real On-Chain Execution if Wallet Connected
            if (this.isWalletConnected && this.contract && this.signer) {
                try {
                    ToastManager.show('Signing transaction with MetaMask...', 'info', 4000);
                    const tx = await this.contract.registerRecord(
                        blockchainHash,
                        recipientWallet,
                        credentialType,
                        ipfsHash
                    );
                    ToastManager.show('Transaction submitted to blockchain. Awaiting confirmation...', 'info', 5000);
                    const receipt = await tx.wait();
                    txHash = receipt.hash;
                    blockNumber = Number(receipt.blockNumber);
                    executionMode = 'Live Blockchain (EVM)';
                } catch (walletErr) {
                    console.warn('On-chain transaction failed/cancelled, falling back to simulated execution:', walletErr);
                    ToastManager.show('On-chain rejected; registered in local verified state.', 'warning', 3500);
                }
            }

            // Fallback simulated block data if not executed on live chain
            if (!txHash) {
                await new Promise(r => setTimeout(r, 1200)); // Realistic block delay simulation
                txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                blockNumber = 6842000 + Math.floor(Math.random() * 500);
            }

            const newRecord = {
                id: studentId,
                studentRoll,
                holderName,
                recipientEmail,
                recipientWallet,
                issuerName,
                accreditation,
                department,
                cohortYear,
                credentialTitle,
                credentialType,
                issueDate,
                expiryDate,
                grade,
                honors,
                sealStyle,
                signatory1,
                signatory2,
                details,
                ipfsHash,
                fileHash,
                blockchainHash,
                txHash,
                blockNumber,
                network: executionMode,
                hashAlgo,
                status: 'valid',
                registeredAt: new Date().toISOString()
            };

            // Save to state and storage
            this.records.unshift(newRecord);
            this.saveRecords();
            this.updateStats();
            this.renderRegistryTable();

            // Display Receipt Modal
            this.displayReceiptModal(newRecord);
            ToastManager.show(`Certificate successfully anchored! ID: ${studentId}`, 'success', 5000);

        } catch (error) {
            console.error('Issuance error:', error);
            ToastManager.show(`Issuance failed: ${error.message || 'Unknown error'}`, 'error', 5000);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-shield-halved"></i> Register & Anchor to Blockchain';
            }
        }
    }

    displayReceiptModal(record) {
        const modal = document.getElementById('receiptModal');
        if (!modal) return;

        document.getElementById('receiptCertId').textContent = record.id;
        document.getElementById('receiptHolder').textContent = record.holderName;
        document.getElementById('receiptMode').textContent = record.network;
        document.getElementById('receiptBlockNumber').textContent = `#${record.blockNumber}`;
        document.getElementById('receiptFileHash').textContent = record.fileHash;
        document.getElementById('receiptRecordHash').textContent = record.blockchainHash;

        const verifyUrl = `${window.location.origin}/verify.html?hash=${encodeURIComponent(record.blockchainHash)}&holder=${encodeURIComponent(record.holderName)}&id=${encodeURIComponent(record.id)}`;
        const urlInput = document.getElementById('receiptVerifyUrl');
        if (urlInput) urlInput.value = verifyUrl;

        const openVerifyBtn = document.getElementById('btnOpenVerifyModal');
        if (openVerifyBtn) openVerifyBtn.href = verifyUrl;

        // Render QR Thumbnail
        const qrThumb = document.getElementById('receiptQrThumb');
        if (qrThumb) {
            qrThumb.innerHTML = '';
            new QRCode(qrThumb, {
                text: verifyUrl,
                width: 90,
                height: 90,
                colorDark: '#0f172a',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        }

        modal.style.display = 'flex';
    }

    // ========================================================================
    // BATCH BULK ISSUANCE (CSV / JSON)
    // ========================================================================
    setupBatchUpload() {
        const dropzone = document.getElementById('batchDropzone');
        const fileInput = document.getElementById('batchFileInput');
        const btnDownloadTemplate = document.getElementById('btnDownloadBatchTemplate');
        const btnLoadSample = document.getElementById('btnLoadSampleBatch');
        const btnAnchorBatch = document.getElementById('btnAnchorBatch');

        dropzone?.addEventListener('click', () => fileInput?.click());

        dropzone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone?.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone?.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                await this.handleBatchFile(e.dataTransfer.files[0]);
            }
        });

        fileInput?.addEventListener('change', async () => {
            if (fileInput.files.length > 0) {
                await this.handleBatchFile(fileInput.files[0]);
            }
        });

        btnDownloadTemplate?.addEventListener('click', () => {
            this.downloadBatchCsvTemplate();
        });

        btnLoadSample?.addEventListener('click', async () => {
            await this.loadSampleBatchData();
        });

        btnAnchorBatch?.addEventListener('click', async () => {
            await this.executeBatchAnchor();
        });
    }

    downloadBatchCsvTemplate() {
        const csvContent = 'holderName,studentId,email,walletAddress,degreeTitle,credentialType,issuerName,department,issueDate,grade\n' +
            'Sophia Martinez,CC-2026-8801,sophia.m@mit.edu,,Master of Science in Cybersecurity,Master\'s Degree,CryptaCore Institute,Computer Science,2026-09-01,Grade A+\n' +
            'Liam Patel,CC-2026-8802,liam.p@stanford.edu,,Bachelor of Technology in DLT,Bachelor\'s Degree,CryptaCore Institute,Computer Science,2026-09-01,Grade A\n' +
            'Zoe Washington,CC-2026-8803,zoe.w@cambridge.edu,,Certified Smart Contract Auditor,Professional Certification,CryptaCore Institute,Security,2026-09-01,Distinction\n';

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'cryptacore_batch_certificate_template.csv';
        link.click();

        ToastManager.show('CSV Template downloaded!', 'success', 2500);
    }

    async handleBatchFile(file) {
        if (!file) return;

        const text = await file.text();
        let records = [];

        try {
            if (file.name.endsWith('.json')) {
                records = JSON.parse(text);
            } else {
                records = this.parseCsv(text);
            }

            if (!records || records.length === 0) {
                ToastManager.show('No valid certificate records found in file.', 'error', 3500);
                return;
            }

            await this.processAndDisplayBatch(records);
            ToastManager.show(`Parsed ${records.length} records successfully!`, 'success', 3000);

        } catch (error) {
            console.error('Batch parse error:', error);
            ToastManager.show(`Failed to parse batch file: ${error.message}`, 'error', 4000);
        }
    }

    parseCsv(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        const records = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            const entry = {};
            headers.forEach((header, idx) => {
                entry[header] = values[idx] || '';
            });

            if (entry.holderName || entry.name) {
                records.push({
                    holderName: entry.holderName || entry.name || 'Student',
                    studentId: entry.studentId || entry.id || CryptoUtil.generateCertId(),
                    recipientEmail: entry.email || '',
                    recipientWallet: entry.walletAddress || CryptoUtil.randomAddress(),
                    credentialTitle: entry.degreeTitle || entry.title || 'Certificate of Completion',
                    credentialType: entry.credentialType || "Bachelor's Degree",
                    issuerName: entry.issuerName || 'CryptaCore Institute of Technology',
                    department: entry.department || 'Department of Computer Science',
                    issueDate: entry.issueDate || new Date().toISOString().split('T')[0],
                    grade: entry.grade || 'Passed',
                    details: 'Batch enrolled credential'
                });
            }
        }

        return records;
    }

    async loadSampleBatchData() {
        const sampleBatch = [
            {
                holderName: 'Marcus Vance',
                studentId: 'CC-2026-9101',
                recipientEmail: 'marcus.v@oxford.ac.uk',
                recipientWallet: CryptoUtil.randomAddress(),
                credentialTitle: 'Doctor of Philosophy in Quantum Cryptography',
                credentialType: 'Doctorate (PhD)',
                issuerName: 'CryptaCore Research Institute',
                department: 'Quantum Algorithms Laboratory',
                issueDate: '2026-09-01',
                grade: 'Highest Honors (Summa Cum Laude)',
                details: 'Dissertation on Lattice-Based Zero-Knowledge Signatures.'
            },
            {
                holderName: 'Aarav Sharma',
                studentId: 'CC-2026-9102',
                recipientEmail: 'aarav.sharma@iit.ac.in',
                recipientWallet: CryptoUtil.randomAddress(),
                credentialTitle: 'Bachelor of Technology in Distributed Ledger Systems',
                credentialType: "Bachelor's Degree",
                issuerName: 'CryptaCore Institute of Technology',
                department: 'Computer Science & Engineering',
                issueDate: '2026-09-01',
                grade: 'Grade A+ / 9.8 CGPA (Institute Gold Medal)',
                details: 'Specialization in Layer-2 Scalability and Rollups.'
            },
            {
                holderName: 'Seraphina Dubois',
                studentId: 'CC-2026-9103',
                recipientEmail: 'seraphina.d@sorbonne.fr',
                recipientWallet: CryptoUtil.randomAddress(),
                credentialTitle: 'Master of Science in Financial Cryptography',
                credentialType: "Master's Degree",
                issuerName: 'CryptaCore Institute of Technology',
                department: 'Financial Technology & Decentralized Economics',
                issueDate: '2026-09-01',
                grade: 'Grade A / 3.94 GPA',
                details: 'Automated Market Maker invariant stability analysis.'
            },
            {
                holderName: 'Kenji Takahashi',
                studentId: 'CC-2026-9104',
                recipientEmail: 'kenji.t@tokyo.ac.jp',
                recipientWallet: CryptoUtil.randomAddress(),
                credentialTitle: 'Certified Smart Contract Security Auditor (Level 3)',
                credentialType: 'Professional Certification',
                issuerName: 'Ethereum Security Council',
                department: 'Auditing Board',
                issueDate: '2026-09-01',
                grade: 'Score: 99/100',
                details: 'EVM formal verification mastery.'
            },
            {
                holderName: 'Amara Okafor',
                studentId: 'CC-2026-9105',
                recipientEmail: 'amara.okafor@africanblockchain.org',
                recipientWallet: CryptoUtil.randomAddress(),
                credentialTitle: 'Postgraduate Diploma in Decentralized Identity',
                credentialType: 'Diploma',
                issuerName: 'CryptaCore Institute of Technology',
                department: 'W3C Verifiable Credentials Taskforce',
                issueDate: '2026-09-01',
                grade: 'Distinction (Top 1%)',
                details: 'Self-Sovereign Identity framework implementation.'
            }
        ];

        await this.processAndDisplayBatch(sampleBatch);
        ToastManager.show('Loaded 5 sample batch records with computed Merkle Root!', 'success', 3000);
    }

    async processAndDisplayBatch(records) {
        this.batchParsedRecords = [];
        const hashes = [];

        for (let i = 0; i < records.length; i++) {
            const item = records[i];
            const metaStr = JSON.stringify(item);
            const shaHash = await CryptoUtil.sha256Text(metaStr);
            const blockchainHash = await CryptoUtil.sha256Text(`${shaHash}_${item.studentId}`);
            
            const processed = {
                ...item,
                fileHash: shaHash,
                blockchainHash: blockchainHash,
                ipfsHash: CryptoUtil.generateIpfsCid(),
                status: 'valid'
            };

            this.batchParsedRecords.push(processed);
            hashes.push(shaHash);
        }

        // Derive Merkle Root
        const merkleRoot = await CryptoUtil.calculateMerkleRoot(hashes);

        // Render UI
        const previewSection = document.getElementById('batchPreviewSection');
        const countEl = document.getElementById('batchRecordsCount');
        const rootEl = document.getElementById('batchMerkleRoot');
        const tbody = document.getElementById('batchTableBody');

        if (previewSection) previewSection.style.display = 'block';
        if (countEl) countEl.textContent = this.batchParsedRecords.length;
        if (rootEl) {
            rootEl.textContent = merkleRoot;
            rootEl.title = merkleRoot;
        }

        if (tbody) {
            tbody.innerHTML = this.batchParsedRecords.map((rec, idx) => `
                <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${rec.studentId}</strong></td>
                    <td>${rec.holderName}</td>
                    <td>${rec.credentialTitle}</td>
                    <td>${rec.issuerName}</td>
                    <td>${rec.issueDate}</td>
                    <td><code class="hash-snippet" title="${rec.fileHash}">${rec.fileHash.substring(0, 14)}...</code></td>
                    <td><span class="badge-status badge-valid">Ready</span></td>
                </tr>
            `).join('');
        }
    }

    async executeBatchAnchor() {
        if (!this.batchParsedRecords || this.batchParsedRecords.length === 0) {
            ToastManager.show('No batch records to anchor.', 'warning', 3000);
            return;
        }

        const btnAnchor = document.getElementById('btnAnchorBatch');
        if (btnAnchor) {
            btnAnchor.disabled = true;
            btnAnchor.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Anchoring Batch on Blockchain...';
        }

        await new Promise(r => setTimeout(r, 1500));

        let anchoredCount = 0;
        const now = new Date().toISOString();

        this.batchParsedRecords.forEach(rec => {
            const newRecord = {
                ...rec,
                txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
                blockNumber: 6843000 + Math.floor(Math.random() * 100),
                network: 'Batch Merkle Anchor (Simulated)',
                registeredAt: now
            };
            this.records.unshift(newRecord);
            anchoredCount++;
        });

        this.saveRecords();
        this.updateStats();
        this.renderRegistryTable();

        if (btnAnchor) {
            btnAnchor.disabled = false;
            btnAnchor.innerHTML = '<i class="fas fa-check-circle"></i> Batch Successfully Anchored!';
            setTimeout(() => {
                btnAnchor.innerHTML = '<i class="fas fa-cubes-stacked"></i> Anchor Entire Batch to Blockchain';
            }, 3000);
        }

        ToastManager.show(`Successfully anchored batch of ${anchoredCount} certificates to blockchain!`, 'success', 5000);

        // Switch to Registry Tab to show them
        const registryTabBtn = document.querySelector('[data-tab="registry-tab"]');
        registryTabBtn?.click();
    }

    // ========================================================================
    // CERTIFICATE REGISTRY LEDGER & OPERATIONS
    // ========================================================================
    setupRegistryLedger() {
        const searchInput = document.getElementById('registrySearchInput');
        const btnClearSearch = document.getElementById('btnClearSearch');
        const statusFilter = document.getElementById('registryStatusFilter');
        const typeFilter = document.getElementById('registryTypeFilter');
        const btnExportCsv = document.getElementById('btnExportCsv');
        const btnExportJson = document.getElementById('btnExportJson');
        const btnClearRegistry = document.getElementById('btnClearRegistry');
        const btnEmptyStateSample = document.getElementById('btnEmptyStateSample');

        searchInput?.addEventListener('input', () => {
            if (btnClearSearch) {
                btnClearSearch.style.display = searchInput.value ? 'block' : 'none';
            }
            this.renderRegistryTable();
        });

        btnClearSearch?.addEventListener('click', () => {
            searchInput.value = '';
            btnClearSearch.style.display = 'none';
            this.renderRegistryTable();
        });

        statusFilter?.addEventListener('change', () => this.renderRegistryTable());
        typeFilter?.addEventListener('change', () => this.renderRegistryTable());

        btnExportCsv?.addEventListener('click', () => this.exportRegistryCsv());
        btnExportJson?.addEventListener('click', () => this.exportRegistryJson());

        btnClearRegistry?.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all local certificate registry records?')) {
                this.records = [];
                this.saveRecords();
                this.updateStats();
                this.renderRegistryTable();
                ToastManager.show('All registry records cleared.', 'info', 2500);
            }
        });

        btnEmptyStateSample?.addEventListener('click', () => {
            this.records = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_RECORDS));
            this.saveRecords();
            this.updateStats();
            this.renderRegistryTable();
            ToastManager.show('Sample certificates restored!', 'success', 2500);
        });
    }

    renderRegistryTable() {
        const tbody = document.getElementById('registryTableBody');
        const emptyState = document.getElementById('registryEmptyState');
        const searchVal = (document.getElementById('registrySearchInput')?.value || '').toLowerCase().trim();
        const statusVal = document.getElementById('registryStatusFilter')?.value || 'all';
        const typeVal = document.getElementById('registryTypeFilter')?.value || 'all';

        if (!tbody) return;

        // Filter records
        const filtered = this.records.filter(rec => {
            const matchesSearch = !searchVal || 
                (rec.holderName && rec.holderName.toLowerCase().includes(searchVal)) ||
                (rec.id && rec.id.toLowerCase().includes(searchVal)) ||
                (rec.issuerName && rec.issuerName.toLowerCase().includes(searchVal)) ||
                (rec.blockchainHash && rec.blockchainHash.toLowerCase().includes(searchVal)) ||
                (rec.credentialTitle && rec.credentialTitle.toLowerCase().includes(searchVal));

            const isExpired = rec.expiryDate && new Date(rec.expiryDate) < new Date();
            const actualStatus = rec.status === 'revoked' ? 'revoked' : isExpired ? 'expired' : 'valid';

            const matchesStatus = statusVal === 'all' || actualStatus === statusVal;
            const matchesType = typeVal === 'all' || rec.credentialType === typeVal;

            return matchesSearch && matchesStatus && matchesType;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        tbody.innerHTML = filtered.map(rec => {
            const isExpired = rec.expiryDate && new Date(rec.expiryDate) < new Date();
            const actualStatus = rec.status === 'revoked' ? 'revoked' : isExpired ? 'expired' : 'valid';

            const statusBadgeMap = {
                valid: '<span class="badge-status badge-valid"><i class="fas fa-check-circle"></i> Valid</span>',
                expired: '<span class="badge-status badge-expired"><i class="fas fa-clock"></i> Expired</span>',
                revoked: '<span class="badge-status badge-revoked"><i class="fas fa-ban"></i> Revoked</span>'
            };

            return `
                <tr class="registry-row" data-id="${rec.id}">
                    <td><strong>${rec.id}</strong></td>
                    <td>
                        <div class="table-holder-info">
                            <span class="holder-name">${rec.holderName}</span>
                            ${rec.recipientEmail ? `<span class="holder-sub">${rec.recipientEmail}</span>` : ''}
                        </div>
                    </td>
                    <td>
                        <div class="table-credential-info">
                            <span class="cred-title">${rec.credentialTitle}</span>
                            <span class="cred-type-pill">${rec.credentialType}</span>
                        </div>
                    </td>
                    <td><span class="issuer-name-tag">${rec.issuerName}</span></td>
                    <td>${rec.issueDate}</td>
                    <td>${statusBadgeMap[actualStatus]}</td>
                    <td>
                        <code class="hash-snippet" title="${rec.blockchainHash}">${rec.blockchainHash.substring(0, 14)}...</code>
                    </td>
                    <td>
                        <div class="row-actions">
                            <button type="button" class="btn-action" title="View Full Record" onclick="certificateManager.viewRecordDetails('${rec.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button type="button" class="btn-action" title="Show Verification QR Code" onclick="certificateManager.showQrModal('${rec.id}')">
                                <i class="fas fa-qrcode"></i>
                            </button>
                            <button type="button" class="btn-action" title="Copy Public Verification Link" onclick="certificateManager.copyVerifyUrl('${rec.id}')">
                                <i class="fas fa-link"></i>
                            </button>
                            <button type="button" class="btn-action" title="Download High-Res Certificate" onclick="certificateManager.downloadRecordCertificate('${rec.id}')">
                                <i class="fas fa-file-arrow-down"></i>
                            </button>
                            ${actualStatus !== 'revoked' ? `
                                <button type="button" class="btn-action btn-action-danger" title="Revoke Certificate" onclick="certificateManager.promptRevocation('${rec.id}')">
                                    <i class="fas fa-ban"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    viewRecordDetails(id) {
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        const modal = document.getElementById('detailsModal');
        const body = document.getElementById('detailsModalBody');
        if (!modal || !body) return;

        const isExpired = record.expiryDate && new Date(record.expiryDate) < new Date();
        const actualStatus = record.status === 'revoked' ? 'Revoked' : isExpired ? 'Expired' : 'Valid & Active';

        body.innerHTML = `
            <div class="record-details-grid">
                <div class="detail-row">
                    <span class="detail-label">Certificate ID:</span>
                    <strong>${record.id}</strong>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="badge-status badge-${actualStatus.toLowerCase().includes('valid') ? 'valid' : actualStatus.toLowerCase()}">${actualStatus}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Recipient Name:</span>
                    <strong>${record.holderName}</strong>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Recipient Email:</span>
                    <span>${record.recipientEmail || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Recipient Wallet:</span>
                    <code>${record.recipientWallet || 'N/A'}</code>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Issuing Authority:</span>
                    <span>${record.issuerName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Department:</span>
                    <span>${record.department || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Credential Title:</span>
                    <strong>${record.credentialTitle}</strong>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Classification:</span>
                    <span>${record.credentialType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Issue Date:</span>
                    <span>${record.issueDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Expiry Date:</span>
                    <span>${record.expiryDate || 'Permanent (No Expiry)'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Grade / Honors:</span>
                    <span>${record.grade || 'N/A'}</span>
                </div>
                <div class="detail-row full-width">
                    <span class="detail-label">Remarks / Details:</span>
                    <p>${record.details || 'None'}</p>
                </div>
                <div class="detail-row full-width">
                    <span class="detail-label">Document SHA-256 Digest:</span>
                    <code class="code-block">${record.fileHash}</code>
                </div>
                <div class="detail-row full-width">
                    <span class="detail-label">Blockchain Record Hash:</span>
                    <code class="code-block">${record.blockchainHash}</code>
                </div>
                <div class="detail-row full-width">
                    <span class="detail-label">Transaction Hash:</span>
                    <code class="code-block">${record.txHash || 'N/A'}</code>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Block Number:</span>
                    <span>#${record.blockNumber || 'Simulated'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">IPFS CID:</span>
                    <code>${record.ipfsHash || 'N/A'}</code>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    showQrModal(id) {
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        this.currentQrRecord = record;
        this.qrColorDark = '#0f172a';
        this.qrColorLight = '#ffffff';
        this.qrEcc = 'H';
        this.qrPayloadMode = 'url';
        this.qrShowCenterLogo = true;
        this.qrResolution = 1024;

        const modal = document.getElementById('qrModal');
        const title = document.getElementById('qrModalTitle');
        const subtitle = document.getElementById('qrModalSubtitle');
        const barcodeSvg = document.getElementById('barcodeModalElement');
        const btnOpenVerify = document.getElementById('btnOpenQrVerifyLink');

        if (!modal) return;

        if (title) title.textContent = `Verification QR Studio: ${record.holderName}`;
        if (subtitle) subtitle.textContent = `Credential ID: ${record.id} • Blockchain Verified`;

        const verifyUrl = `${window.location.origin}/verify.html?hash=${encodeURIComponent(record.blockchainHash)}&holder=${encodeURIComponent(record.holderName)}&id=${encodeURIComponent(record.id)}`;
        if (btnOpenVerify) btnOpenVerify.href = verifyUrl;

        // Render Barcode (Code-128)
        if (barcodeSvg && typeof JsBarcode !== 'undefined') {
            try {
                JsBarcode(barcodeSvg, record.id, {
                    format: 'CODE128',
                    lineColor: '#0f172a',
                    width: 2,
                    height: 44,
                    displayValue: true,
                    fontSize: 13,
                    font: 'Fira Code, monospace'
                });
            } catch (e) {
                console.warn('Barcode rendering error:', e);
            }
        }

        // Setup Studio Listeners (Color Presets)
        const colorBtns = modal.querySelectorAll('.color-preset-btn');
        colorBtns.forEach(btn => {
            btn.onclick = () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.qrColorDark = btn.getAttribute('data-color') || '#0f172a';
                this.qrColorLight = btn.getAttribute('data-bg') || '#ffffff';
                this.renderStudioQr();
            };
        });

        // Error Correction selector
        const eccSelect = document.getElementById('qrEccSelect');
        if (eccSelect) {
            eccSelect.value = this.qrEcc;
            eccSelect.onchange = () => {
                this.qrEcc = eccSelect.value;
                this.renderStudioQr();
            };
        }

        // Resolution selector
        const resSelect = document.getElementById('qrResolutionSelect');
        if (resSelect) {
            resSelect.onchange = () => {
                this.qrResolution = parseInt(resSelect.value) || 1024;
            };
        }

        // Center Logo Toggle
        const logoToggle = document.getElementById('toggleQrCenterLogo');
        const centerShield = document.getElementById('qrCenterShield');
        if (logoToggle) {
            logoToggle.checked = this.qrShowCenterLogo;
            logoToggle.onchange = () => {
                this.qrShowCenterLogo = logoToggle.checked;
                if (centerShield) centerShield.style.display = this.qrShowCenterLogo ? 'flex' : 'none';
            };
        }

        // Payload Mode Radios
        const payloadRadios = modal.querySelectorAll('input[name="qrPayloadMode"]');
        payloadRadios.forEach(radio => {
            radio.onchange = () => {
                modal.querySelectorAll('.radio-card').forEach(rc => rc.classList.remove('active'));
                radio.closest('.radio-card')?.classList.add('active');
                this.qrPayloadMode = radio.value;
                this.renderStudioQr();
            };
        });

        // Copy to clipboard action
        const btnCopyClip = document.getElementById('btnCopyQrClipboard');
        if (btnCopyClip) {
            btnCopyClip.onclick = async () => {
                await this.copyQrToClipboard();
            };
        }

        // Print Badge action
        const btnPrintBadge = document.getElementById('btnPrintQrBadge');
        if (btnPrintBadge) {
            btnPrintBadge.onclick = () => {
                this.printQrBadge(record);
            };
        }

        // Download High-Res Image action
        const btnDownloadQr = document.getElementById('btnDownloadQrImage');
        if (btnDownloadQr) {
            btnDownloadQr.onclick = () => {
                this.downloadHighResQr(record);
            };
        }

        // Initial Studio Render
        this.renderStudioQr();
        modal.style.display = 'flex';
    }

    renderStudioQr() {
        const record = this.currentQrRecord;
        if (!record) return;

        const qrContainer = document.getElementById('qrModalCode');
        const payloadDisplay = document.getElementById('qrActivePayloadText');
        if (!qrContainer) return;

        // Compute payload string
        let payloadText = '';
        if (this.qrPayloadMode === 'url') {
            payloadText = `${window.location.origin}/verify.html?hash=${encodeURIComponent(record.blockchainHash)}&holder=${encodeURIComponent(record.holderName)}&id=${encodeURIComponent(record.id)}`;
        } else if (this.qrPayloadMode === 'json') {
            const vcPayload = {
                "@context": ["https://www.w3.org/2018/credentials/v1"],
                "type": ["VerifiableCredential", "CryptaCoreRecord"],
                "issuer": record.issuerName,
                "issuanceDate": record.issueDate,
                "credentialSubject": {
                    "id": record.id,
                    "name": record.holderName,
                    "degree": record.credentialTitle,
                    "grade": record.grade || 'N/A',
                    "wallet": record.recipientWallet
                },
                "proof": {
                    "type": "CryptaCoreEthereumSignature2026",
                    "merkleRoot": record.blockchainHash,
                    "txHash": record.txHash || '0xSimulatedProof'
                }
            };
            payloadText = JSON.stringify(vcPayload);
        } else if (this.qrPayloadMode === 'hash') {
            payloadText = `cryptacore://anchor/${record.blockchainHash}?fileHash=${record.fileHash}`;
        }

        if (payloadDisplay) {
            payloadDisplay.textContent = payloadText;
        }

        // Map ECC string
        let eccLevel = QRCode.CorrectLevel.H;
        if (this.qrEcc === 'Q') eccLevel = QRCode.CorrectLevel.Q;
        else if (this.qrEcc === 'M') eccLevel = QRCode.CorrectLevel.M;
        else if (this.qrEcc === 'L') eccLevel = QRCode.CorrectLevel.L;

        qrContainer.innerHTML = '';
        try {
            this.activeStudioQr = new QRCode(qrContainer, {
                text: payloadText,
                width: 230,
                height: 230,
                colorDark: this.qrColorDark,
                colorLight: this.qrColorLight,
                correctLevel: eccLevel
            });
        } catch (e) {
            console.error('QR rendering error:', e);
            ToastManager.show('Failed to render QR with selected payload length.', 'error', 3000);
        }
    }

    async copyQrToClipboard() {
        const qrContainer = document.getElementById('qrModalCode');
        const canvas = qrContainer?.querySelector('canvas');
        if (!canvas) {
            ToastManager.show('QR canvas not ready.', 'warning', 2000);
            return;
        }

        try {
            canvas.toBlob(async (blob) => {
                if (blob && navigator.clipboard && navigator.clipboard.write) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    ToastManager.show('QR Code copied to clipboard as PNG image!', 'success', 2500);
                } else {
                    ToastManager.show('Clipboard image write not supported in this browser.', 'warning', 3000);
                }
            });
        } catch (err) {
            console.error('Clipboard copy error:', err);
            ToastManager.show('Unable to copy QR to clipboard.', 'error', 2500);
        }
    }

    downloadHighResQr(record) {
        const qrContainer = document.getElementById('qrModalCode');
        const sourceCanvas = qrContainer?.querySelector('canvas');
        if (!sourceCanvas) return;

        // Render high-res framed badge canvas
        const exportCanvas = document.createElement('canvas');
        const size = this.qrResolution || 1024;
        exportCanvas.width = size;
        exportCanvas.height = size + 240; // extra space for header and ID label
        const ctx = exportCanvas.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        // Frame Border
        ctx.strokeStyle = this.qrColorDark || '#0f172a';
        ctx.lineWidth = Math.round(size * 0.015);
        ctx.strokeRect(20, 20, exportCanvas.width - 40, exportCanvas.height - 40);

        // Header Title
        ctx.fillStyle = this.qrColorDark || '#0f172a';
        ctx.font = `bold ${Math.round(size * 0.045)}px "Cinzel", "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('CRYPTACORE TRUST LAYER', exportCanvas.width / 2, Math.round(size * 0.08));

        ctx.fillStyle = '#64748b';
        ctx.font = `500 ${Math.round(size * 0.025)}px Inter, sans-serif`;
        ctx.fillText('Scan to Verify Blockchain Authenticity', exportCanvas.width / 2, Math.round(size * 0.12));

        // Draw QR code scaled in center
        const qrPadding = Math.round(size * 0.06);
        const qrDrawSize = size - (qrPadding * 2);
        ctx.drawImage(sourceCanvas, qrPadding, Math.round(size * 0.16), qrDrawSize, qrDrawSize);

        // Center Logo if enabled
        if (this.qrShowCenterLogo) {
            const logoSize = Math.round(qrDrawSize * 0.2);
            const logoX = (exportCanvas.width - logoSize) / 2;
            const logoY = Math.round(size * 0.16) + (qrDrawSize - logoSize) / 2;

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(exportCanvas.width / 2, logoY + logoSize / 2, logoSize / 2 + 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = this.qrColorDark || '#0f172a';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = this.qrColorDark || '#0f172a';
            ctx.font = `bold ${Math.round(logoSize * 0.35)}px Inter, sans-serif`;
            ctx.fillText('🛡️ CC', exportCanvas.width / 2, logoY + logoSize / 2 + Math.round(logoSize * 0.12));
        }

        // Footer Metadata: Student Name & ID
        const footerY = size + 130;
        ctx.fillStyle = '#0f172a';
        ctx.font = `bold ${Math.round(size * 0.038)}px "Playfair Display", serif`;
        ctx.fillText(record.holderName, exportCanvas.width / 2, footerY);

        ctx.fillStyle = '#2563eb';
        ctx.font = `bold ${Math.round(size * 0.026)}px "Fira Code", monospace`;
        ctx.fillText(`ID: ${record.id} • ${record.credentialType}`, exportCanvas.width / 2, footerY + Math.round(size * 0.035));

        // Trigger Download
        const a = document.createElement('a');
        a.download = `CryptaCore-QR-Badge-${record.id}-${record.holderName.replace(/\s+/g, '_')}.png`;
        a.href = exportCanvas.toDataURL('image/png');
        a.click();

        ToastManager.show(`High-Resolution QR Badge (${size}x${size + 240}) exported!`, 'success', 3000);
    }

    printQrBadge(record) {
        const qrContainer = document.getElementById('qrModalCode');
        const sourceCanvas = qrContainer?.querySelector('canvas');
        if (!sourceCanvas) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            ToastManager.show('Popup blocked! Please allow popups to print badge.', 'warning', 3500);
            return;
        }

        const qrDataUrl = sourceCanvas.toDataURL();
        const verifyUrl = `${window.location.origin}/verify.html?hash=${encodeURIComponent(record.blockchainHash)}&holder=${encodeURIComponent(record.holderName)}&id=${encodeURIComponent(record.id)}`;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>CryptaCore Verification Sticker - ${record.id}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8fafc; }
                    .badge-card { width: 340px; padding: 24px; border: 2px solid #0f172a; border-radius: 12px; background: #fff; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    .badge-header { font-size: 14px; font-weight: 800; color: #0f172a; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
                    .badge-sub { font-size: 11px; color: #64748b; margin-bottom: 16px; }
                    .qr-img { width: 200px; height: 200px; margin: 0 auto 12px; display: block; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px; }
                    .recipient { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
                    .cert-id { font-size: 13px; font-family: monospace; font-weight: 700; color: #2563eb; margin-bottom: 12px; }
                    .security-text { font-size: 10px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 8px; }
                    @media print { body { background: none; } .badge-card { box-shadow: none; } }
                </style>
            </head>
            <body>
                <div class="badge-card">
                    <div class="badge-header">🛡️ CryptaCore Trust Layer</div>
                    <div class="badge-sub">Tamper-Evident On-Chain Verification</div>
                    <img src="${qrDataUrl}" class="qr-img" alt="QR Code">
                    <div class="recipient">${record.holderName}</div>
                    <div class="cert-id">${record.id}</div>
                    <div class="security-text">Scan with any smartphone camera to verify blockchain validity.</div>
                </div>
                <script>
                    window.onload = () => { window.print(); };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    copyVerifyUrl(id) {
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        const verifyUrl = `${window.location.origin}/verify.html?hash=${encodeURIComponent(record.blockchainHash)}&holder=${encodeURIComponent(record.holderName)}&id=${encodeURIComponent(record.id)}`;
        navigator.clipboard.writeText(verifyUrl);
        ToastManager.show(`Verification link copied for ${record.holderName}!`, 'success', 3000);
    }

    downloadRecordCertificate(id) {
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        // Temporarily populate form to generate image
        document.getElementById('holderNameInput').value = record.holderName;
        document.getElementById('studentIdInput').value = record.id;
        document.getElementById('issuerNameInput').value = record.issuerName;
        document.getElementById('departmentInput').value = record.department || '';
        document.getElementById('credentialTitleInput').value = record.credentialTitle;
        document.getElementById('credentialTypeSelect').value = record.credentialType;
        document.getElementById('issueDateInput').value = record.issueDate;
        document.getElementById('gradeInput').value = record.grade || '';

        this.downloadCertificatePng();
    }

    promptRevocation(id) {
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        this.currentRevokeRecordId = id;
        const modal = document.getElementById('revokeModal');
        const summary = document.getElementById('revokeRecordSummary');
        const reasonInput = document.getElementById('revokeReasonInput');

        if (reasonInput) reasonInput.value = '';
        if (summary) {
            summary.innerHTML = `
                <p><strong>Certificate ID:</strong> ${record.id}</p>
                <p><strong>Holder Name:</strong> ${record.holderName}</p>
                <p><strong>Credential:</strong> ${record.credentialTitle}</p>
            `;
        }

        if (modal) modal.style.display = 'flex';
    }

    async confirmRevocation() {
        if (!this.currentRevokeRecordId) return;

        const reason = document.getElementById('revokeReasonInput')?.value.trim();
        if (!reason) {
            ToastManager.show('Please provide a reason for certificate revocation.', 'warning', 3000);
            return;
        }

        let record = this.records.find(r => r.id === this.currentRevokeRecordId);
        const storeRecord = window.CryptaCoreStore?.getRecord(this.currentRevokeRecordId);

        if (!record && !storeRecord) {
            ToastManager.show('Target record not found for revocation.', 'error', 3000);
            return;
        }

        const targetHash = record?.blockchainHash || storeRecord?.recordHash;

        // Real on-chain revocation if connected
        if (this.isWalletConnected && this.contract && this.signer && targetHash) {
            try {
                ToastManager.show('Submitting on-chain revocation transaction...', 'info', 3000);
                const tx = await this.contract.revokeRecord(targetHash);
                await tx.wait();
                ToastManager.show('On-chain revocation confirmed!', 'success', 3000);
            } catch (err) {
                console.warn('On-chain revoke failed/rejected:', err);
            }
        }

        if (record) {
            record.status = 'revoked';
            record.revokedAt = new Date().toISOString();
            record.revokeReason = reason;
            this.saveRecords();
            this.updateStats();
            this.renderRegistryTable();
        }

        if (window.CryptaCoreStore) {
            window.CryptaCoreStore.revokeRecord(this.currentRevokeRecordId, reason, 'System Administrator');
            this.renderOverviewDashboard();
            this.renderLicenseTable();
            this.renderCredentialTable();
        }

        const modal = document.getElementById('revokeModal');
        if (modal) modal.style.display = 'none';

        const displayName = record?.holderName || storeRecord?.holder || this.currentRevokeRecordId;
        ToastManager.show(`Record ${this.currentRevokeRecordId} (${displayName}) has been formally REVOKED.`, 'error', 4500);
    }

    exportRegistryCsv() {
        if (this.records.length === 0) {
            ToastManager.show('Registry is empty. Nothing to export.', 'warning', 2500);
            return;
        }

        const headers = ['id', 'holderName', 'recipientEmail', 'recipientWallet', 'issuerName', 'department', 'credentialTitle', 'credentialType', 'issueDate', 'expiryDate', 'grade', 'status', 'blockchainHash', 'fileHash', 'txHash', 'blockNumber', 'ipfsHash'];
        
        let csv = headers.join(',') + '\n';
        this.records.forEach(r => {
            const row = headers.map(h => {
                const val = r[h] !== undefined ? String(r[h]).replace(/"/g, '""') : '';
                return `"${val}"`;
            }).join(',');
            csv += row + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `CryptaCore_Certificate_Registry_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        ToastManager.show('Exported Certificate Registry to CSV!', 'success', 3000);
    }

    exportRegistryJson() {
        if (this.records.length === 0) {
            ToastManager.show('Registry is empty. Nothing to export.', 'warning', 2500);
            return;
        }

        const jsonStr = JSON.stringify(this.records, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `CryptaCore_Certificate_Registry_${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        ToastManager.show('Exported Certificate Registry to JSON!', 'success', 3000);
    }

    // ========================================================================
    // MODALS SETUP & HELPERS
    // ========================================================================
    setupModals() {
        // Close modal handlers
        const closeSelectors = [
            ['#btnCloseReceiptModal', '#receiptModal'],
            ['#btnDoneReceipt', '#receiptModal'],
            ['#btnCloseDetailsModal', '#detailsModal'],
            ['#btnCloseDetailsBtn', '#detailsModal'],
            ['#btnCloseQrModal', '#qrModal'],
            ['#btnCloseQrBtn', '#qrModal'],
            ['#btnCloseRevokeModal', '#revokeModal'],
            ['#btnCancelRevoke', '#revokeModal']
        ];

        closeSelectors.forEach(([btnSel, modalSel]) => {
            const btn = document.querySelector(btnSel);
            const modal = document.querySelector(modalSel);
            btn?.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Copy buttons
        document.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-copy-target');
                const text = document.getElementById(targetId)?.textContent;
                if (text) {
                    navigator.clipboard.writeText(text);
                    ToastManager.show('Copied to clipboard!', 'success', 2000);
                }
            });
        });

        const btnCopyVerifyUrl = document.getElementById('btnCopyVerifyUrl');
        btnCopyVerifyUrl?.addEventListener('click', () => {
            const input = document.getElementById('receiptVerifyUrl');
            if (input?.value) {
                navigator.clipboard.writeText(input.value);
                ToastManager.show('Public Verification Link copied!', 'success', 2500);
            }
        });

        // Revocation confirm
        const btnConfirmRevoke = document.getElementById('btnConfirmRevoke');
        btnConfirmRevoke?.addEventListener('click', () => this.confirmRevocation());
    }

    // ========================================================================
    // EXTENDED CRYPTACORE ARCHITECTURE: RBAC & 4 NEW MODULE CONTROLLERS
    // ========================================================================

    setupRBAC() {
        const roleSelector = document.getElementById('roleSelector');
        if (!roleSelector) return;

        const currentRole = window.RBACManager?.getRole() || 'ADMIN';
        roleSelector.value = currentRole;
        this.updateRolePermissions(currentRole);

        roleSelector.addEventListener('change', (e) => {
            const selectedRole = e.target.value;
            window.RBACManager?.setRole(selectedRole);
            this.updateRolePermissions(selectedRole);

            const details = window.RBACManager?.getRoleDetails(selectedRole);
            ToastManager.show(`Switched Role: ${details?.name || selectedRole} - ${details?.description}`, 'info', 3500);
        });

        document.addEventListener('cryptacore:role-changed', (e) => {
            const role = e.detail?.role;
            if (role && roleSelector.value !== role) {
                roleSelector.value = role;
                this.updateRolePermissions(role);
            }
        });
    }

    updateRolePermissions(role) {
        const btnIssueLic = document.getElementById('btnOpenIssueLicenseModal');
        const btnIssueCred = document.getElementById('btnOpenIssueCredentialModal');
        const btnRegAsset = document.getElementById('btnOpenRegisterAssetModal');
        const btnRegProd = document.getElementById('btnOpenRegisterProductModal');
        const btnAddSupply = document.getElementById('btnOpenAddSupplyEventModal');

        const isVerifier = role === 'VERIFIER';
        const isHolder = role === 'HOLDER';
        const isPartner = role === 'SUPPLY_CHAIN_PARTNER';

        // Adjust visibility or disabled state based on active persona
        if (btnIssueLic) btnIssueLic.style.display = (isVerifier || isHolder || isPartner) ? 'none' : 'inline-flex';
        if (btnIssueCred) btnIssueCred.style.display = (isVerifier || isHolder || isPartner) ? 'none' : 'inline-flex';
        if (btnRegAsset) btnRegAsset.style.display = (isVerifier || isPartner) ? 'none' : 'inline-flex';
        if (btnRegProd) btnRegProd.style.display = (isVerifier || isHolder) ? 'none' : 'inline-flex';
        if (btnAddSupply) btnAddSupply.style.display = (isVerifier || isHolder) ? 'none' : 'inline-flex';
    }

    setupOverviewDashboard() {
        const searchInput = document.getElementById('dashSearchInput');
        const typeFilter = document.getElementById('dashTypeFilter');
        const statusFilter = document.getElementById('dashStatusFilter');
        const btnReset = document.getElementById('btnResetDashFilters');

        const triggerRender = () => this.renderOverviewDashboard();

        searchInput?.addEventListener('input', triggerRender);
        typeFilter?.addEventListener('change', triggerRender);
        statusFilter?.addEventListener('change', triggerRender);

        btnReset?.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (typeFilter) typeFilter.value = 'ALL';
            if (statusFilter) statusFilter.value = 'ALL';
            this.renderOverviewDashboard();
            ToastManager.show('Overview filters reset', 'info', 1500);
        });
    }

    renderOverviewDashboard() {
        if (!window.CryptaCoreStore) return;
        const store = window.CryptaCoreStore;
        const stats = store.getStats();

        // Update metric cards
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setVal('dashStatTotal', stats.total);
        setVal('dashStatLicenses', stats.activeLicenses);
        setVal('dashStatCredentials', stats.credentials);
        setVal('dashStatAssets', stats.assets);
        setVal('dashStatSupplyChain', stats.supplyChain);
        setVal('dashStatRevoked', stats.revoked + stats.expired);
        setVal('dashStatVerifications', stats.verificationRequests);

        // Update tab badges
        setVal('licensesCountBadge', stats.licenses);
        setVal('credentialsCountBadge', stats.credentials);
        setVal('assetsCountBadge', stats.assets);
        setVal('supplyChainCountBadge', stats.supplyChain);
        setVal('registryCountBadge', stats.certificates);

        // Query & filter unified records
        const query = (document.getElementById('dashSearchInput')?.value || '').toLowerCase().trim();
        const typeFilter = document.getElementById('dashTypeFilter')?.value || 'ALL';
        const statusFilter = document.getElementById('dashStatusFilter')?.value || 'ALL';

        let records = store.getAllRecords();

        if (typeFilter !== 'ALL') {
            records = records.filter(r => r.recordType === typeFilter);
        }

        if (statusFilter !== 'ALL') {
            records = records.filter(r => r.status === statusFilter);
        }

        if (query) {
            records = records.filter(r => {
                const idM = r.id && r.id.toLowerCase().includes(query);
                const titleM = r.title && r.title.toLowerCase().includes(query);
                const holderM = r.holder && r.holder.toLowerCase().includes(query);
                const issuerM = r.issuer && r.issuer.toLowerCase().includes(query);
                const hashM = r.recordHash && r.recordHash.toLowerCase().includes(query);
                return idM || titleM || holderM || issuerM || hashM;
            });
        }

        const countBadge = document.getElementById('dashFilteredCount');
        if (countBadge) countBadge.textContent = `${records.length} records`;

        // Render Table
        const tbody = document.getElementById('dashRecordsTableBody');
        if (!tbody) return;

        if (records.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-secondary);">
                        <i class="fas fa-folder-open fa-2x" style="opacity: 0.4; margin-bottom: 0.5rem; display: block;"></i>
                        No records match the active search and filter criteria.
                    </td>
                </tr>
            `;
        } else {
            const typeIcons = {
                LICENSE: 'fa-id-card text-emerald',
                CREDENTIAL: 'fa-user-check text-purple',
                DIGITAL_ASSET: 'fa-arrows-split-up-and-left text-cyan',
                SUPPLY_CHAIN: 'fa-truck-fast text-amber',
                CERTIFICATE: 'fa-graduation-cap text-primary'
            };

            tbody.innerHTML = records.map(r => {
                const icon = typeIcons[r.recordType] || 'fa-file text-primary';
                const statusBadge = window.UIComponents ? window.UIComponents.renderStatusBadge(r.status) : r.status;
                const shortHash = r.recordHash ? `${r.recordHash.substring(0, 10)}...${r.recordHash.substring(r.recordHash.length - 6)}` : 'N/A';

                return `
                    <tr>
                        <td>
                            <strong style="color: var(--primary-color); font-family: monospace; font-size: 0.9rem;">${r.id}</strong>
                        </td>
                        <td>
                            <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; font-weight: 700;">
                                <i class="fas ${icon}"></i> ${r.recordType}
                            </span>
                        </td>
                        <td>
                            <strong style="color: var(--text-primary); display: block; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${r.title}">
                                ${r.title}
                            </strong>
                            <span style="font-size: 0.75rem; color: var(--text-secondary);">${r.issuer}</span>
                        </td>
                        <td>
                            <div style="font-weight: 600; color: var(--text-primary);">${r.holder}</div>
                            ${r.holderId ? `<span style="font-size: 0.75rem; color: var(--text-secondary);">${r.holderId}</span>` : ''}
                        </td>
                        <td>${statusBadge}</td>
                        <td>
                            <code style="font-size: 0.75rem; background: var(--bg-secondary); padding: 0.2rem 0.4rem; border-radius: 4px;" title="Click to copy hash" onclick="navigator.clipboard.writeText('${r.recordHash}'); ToastManager.show('Hash copied to clipboard', 'info', 1500);">
                                ${shortHash}
                            </code>
                            <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.2rem;">Block #${r.blockNumber || 6842000}</div>
                        </td>
                        <td>
                            <div class="table-action-btns">
                                <button class="btn-icon-action" title="View Full Details & Audit Trail" onclick="certificateManager.viewUniversalRecord('${r.id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-icon-action" title="Verify on Blockchain" onclick="window.open('verify.html?id=${r.id}', '_blank')">
                                    <i class="fas fa-check-double"></i>
                                </button>
                                <button class="btn-icon-action" title="QR Code & Barcode" onclick="certificateManager.openQrForRecord('${r.id}')">
                                    <i class="fas fa-qrcode"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Render Activity Feed
        const feedContainer = document.getElementById('dashActivityFeed');
        if (feedContainer) {
            const activities = store.activities || [];
            if (activities.length === 0) {
                feedContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">No recent platform activity logged.</p>';
            } else {
                feedContainer.innerHTML = activities.slice(0, 8).map(act => {
                    let actIcon = 'fa-circle-dot';
                    let actColor = '#2563eb';

                    if (act.type.includes('ISSUED')) { actIcon = 'fa-certificate'; actColor = '#10b981'; }
                    else if (act.type.includes('TRANSFERRED')) { actIcon = 'fa-arrow-right-arrow-left'; actColor = '#8b5cf6'; }
                    else if (act.type.includes('DELIVERED')) { actIcon = 'fa-box-open'; actColor = '#06b6d4'; }
                    else if (act.type.includes('VERIFIED')) { actIcon = 'fa-check-double'; actColor = '#10b981'; }
                    else if (act.type.includes('REVOKED')) { actIcon = 'fa-ban'; actColor = '#ef4444'; }
                    else if (act.type.includes('RENEWED')) { actIcon = 'fa-rotate'; actColor = '#f59e0b'; }

                    return `
                        <div class="activity-feed-item" style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.7rem 0.85rem; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color);">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${actColor}20; color: ${actColor}; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;">
                                <i class="fas ${actIcon}"></i>
                            </div>
                            <div style="flex: 1; min-width: 0;">
                                <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                                    <strong style="font-size: 0.82rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${act.title}</strong>
                                    <span style="font-size: 0.7rem; color: var(--text-secondary);">${new Date(act.timestamp).toLocaleDateString()}</span>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem;">
                                    <strong>Target:</strong> <a href="#" onclick="certificateManager.viewUniversalRecord('${act.targetId}'); return false;" style="color: var(--primary-color);">${act.targetId}</a> • <strong>By:</strong> ${act.actor}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    setupLicensePortal() {
        const searchInput = document.getElementById('licenseSearchInput');
        const statusFilter = document.getElementById('licenseStatusFilter');
        const typeFilter = document.getElementById('licenseTypeFilter');
        const btnOpenModal = document.getElementById('btnOpenIssueLicenseModal');
        const modal = document.getElementById('issueLicenseModal');
        const btnClose = document.getElementById('btnCloseIssueLicenseModal');
        const btnCancel = document.getElementById('btnCancelIssueLicense');
        const form = document.getElementById('issueLicenseForm');

        searchInput?.addEventListener('input', () => this.renderLicenseTable());
        statusFilter?.addEventListener('change', () => this.renderLicenseTable());
        typeFilter?.addEventListener('change', () => this.renderLicenseTable());

        btnOpenModal?.addEventListener('click', () => {
            if (modal) modal.style.display = 'flex';
            // Pre-fill today's date and 2-year expiry
            const issueInput = document.getElementById('licIssueDateInput');
            const expiryInput = document.getElementById('licExpiryDateInput');
            const licNumInput = document.getElementById('licNumberInput');

            if (issueInput && !issueInput.value) {
                issueInput.value = new Date().toISOString().split('T')[0];
            }
            if (expiryInput && !expiryInput.value) {
                const exp = new Date();
                exp.setFullYear(exp.getFullYear() + 2);
                expiryInput.value = exp.toISOString().split('T')[0];
            }
            if (licNumInput && !licNumInput.value) {
                licNumInput.value = 'FCAD-UAS-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
            }
        });

        const closeModal = () => { if (modal) modal.style.display = 'none'; };
        btnClose?.addEventListener('click', closeModal);
        btnCancel?.addEventListener('click', closeModal);

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const licNumber = document.getElementById('licNumberInput')?.value.trim();
            const licType = document.getElementById('licTypeSelect')?.value;
            const holder = document.getElementById('licHolderNameInput')?.value.trim();
            const holderId = document.getElementById('licHolderIdInput')?.value.trim();
            const issuer = document.getElementById('licAuthorityInput')?.value.trim();
            const jurisdiction = document.getElementById('licJurisdictionInput')?.value.trim();
            const issueDate = document.getElementById('licIssueDateInput')?.value;
            const expiryDate = document.getElementById('licExpiryDateInput')?.value;
            const desc = document.getElementById('licDescriptionInput')?.value.trim();

            const nextId = 'LIC-2026-' + String(Math.floor(100 + Math.random() * 900));
            const recordHash = await window.CoreCrypto.sha256Text(`${licNumber}-${holder}-${issuer}-${issueDate}`);
            const txHash = window.CoreCrypto.generateTxHash();

            const record = {
                id: nextId,
                recordType: 'LICENSE',
                title: `${licType} - ${licNumber}`,
                issuer,
                holder,
                holderId,
                creationDate: new Date(issueDate).toISOString(),
                expiryDate: new Date(expiryDate).toISOString(),
                status: 'ACTIVE',
                recordHash,
                txHash,
                blockNumber: Math.floor(6843000 + Math.random() * 5000),
                network: 'Sepolia (Simulated)',
                mode: 'demo',
                ipfsHash: window.CoreCrypto.generateIpfsCid(),
                metadata: {
                    licenseNumber: licNumber,
                    licenseType: licType,
                    issuingAuthority: issuer,
                    operatingJurisdiction: jurisdiction || 'Nationwide Territory',
                    description: desc || 'Official operating license issued under statutory authority.'
                },
                auditHistory: [
                    {
                        eventId: 'EVT-' + Date.now().toString(36),
                        timestamp: new Date().toISOString(),
                        action: 'ISSUED',
                        actor: issuer,
                        actorRole: 'ISSUER',
                        details: `License officially minted and authorized on CryptaCore Trust Layer.`,
                        txHash
                    }
                ]
            };

            window.CryptaCoreStore?.addRecord(record);
            form.reset();
            closeModal();
            ToastManager.show(`License ${record.id} successfully issued & anchored to ledger!`, 'success', 4000);
            this.renderLicenseTable();
            this.renderOverviewDashboard();
        });
    }

    renderLicenseTable() {
        if (!window.CryptaCoreStore) return;
        const store = window.CryptaCoreStore;
        let licenses = store.getRecordsByType('LICENSE');

        const query = (document.getElementById('licenseSearchInput')?.value || '').toLowerCase().trim();
        const statusFilter = document.getElementById('licenseStatusFilter')?.value || 'ALL';
        const typeFilter = document.getElementById('licenseTypeFilter')?.value || 'ALL';

        if (statusFilter !== 'ALL') {
            licenses = licenses.filter(l => l.status === statusFilter);
        }

        if (typeFilter !== 'ALL') {
            licenses = licenses.filter(l => (l.metadata?.licenseType || l.title).toLowerCase().includes(typeFilter.toLowerCase()));
        }

        if (query) {
            licenses = licenses.filter(l => {
                const idM = l.id && l.id.toLowerCase().includes(query);
                const numM = l.metadata?.licenseNumber && l.metadata.licenseNumber.toLowerCase().includes(query);
                const holderM = l.holder && l.holder.toLowerCase().includes(query);
                const authM = l.issuer && l.issuer.toLowerCase().includes(query);
                return idM || numM || holderM || authM;
            });
        }

        const tbody = document.getElementById('licensesTableBody');
        if (!tbody) return;

        if (licenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <i class="fas fa-id-card fa-2x" style="opacity: 0.3; margin-bottom: 0.5rem; display: block;"></i>
                        No licenses found matching search criteria.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = licenses.map(l => {
            const statusBadge = window.UIComponents ? window.UIComponents.renderStatusBadge(l.status) : l.status;
            const expiryFormatted = l.expiryDate ? new Date(l.expiryDate).toLocaleDateString() : 'Permanent';
            const shortHash = l.recordHash ? `${l.recordHash.substring(0, 8)}...${l.recordHash.substring(l.recordHash.length - 6)}` : 'N/A';

            return `
                <tr>
                    <td><strong style="color: #10b981; font-family: monospace;">${l.id}</strong></td>
                    <td>
                        <strong style="color: var(--text-primary); display: block;">${l.metadata?.licenseNumber || 'LIC-AUTH'}</strong>
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">${l.metadata?.licenseType || l.title}</span>
                    </td>
                    <td>
                        <div style="font-weight: 700;">${l.holder}</div>
                        ${l.holderId ? `<span style="font-size: 0.72rem; color: var(--text-secondary);">${l.holderId}</span>` : ''}
                    </td>
                    <td style="font-size: 0.85rem; color: var(--text-primary);">${l.issuer}</td>
                    <td>${statusBadge}</td>
                    <td style="font-size: 0.85rem;">${expiryFormatted}</td>
                    <td>
                        <code style="font-size: 0.75rem; background: var(--bg-secondary); padding: 0.2rem 0.4rem; border-radius: 4px; cursor: pointer;" title="Copy SHA-256 Hash" onclick="navigator.clipboard.writeText('${l.recordHash}'); ToastManager.show('License hash copied!', 'info', 1500);">
                            ${shortHash}
                        </code>
                    </td>
                    <td>
                        <div class="table-action-btns">
                            <button class="btn-icon-action" title="View Full Details" onclick="certificateManager.viewUniversalRecord('${l.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon-action" title="Renew License" onclick="certificateManager.promptRenewModal('${l.id}')">
                                <i class="fas fa-rotate"></i>
                            </button>
                            <button class="btn-icon-action" title="Revoke License with Reason" style="color: #ef4444;" onclick="certificateManager.promptRevokeRecordModal('${l.id}')">
                                <i class="fas fa-ban"></i>
                            </button>
                            <button class="btn-icon-action" title="QR Code" onclick="certificateManager.openQrForRecord('${l.id}')">
                                <i class="fas fa-qrcode"></i>
                            </button>
                            <button class="btn-icon-action" title="Verify Portal" onclick="window.open('verify.html?id=${l.id}', '_blank')">
                                <i class="fas fa-check-double"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    setupCredentialPortal() {
        const searchInput = document.getElementById('credentialSearchInput');
        const statusFilter = document.getElementById('credentialStatusFilter');
        const btnToggleHolder = document.getElementById('btnToggleHolderView');
        const btnOpenModal = document.getElementById('btnOpenIssueCredentialModal');
        const modal = document.getElementById('issueCredentialModal');
        const btnClose = document.getElementById('btnCloseIssueCredentialModal');
        const btnCancel = document.getElementById('btnCancelIssueCredential');
        const form = document.getElementById('issueCredentialForm');

        this.isHolderViewOnly = false;

        btnToggleHolder?.addEventListener('click', () => {
            this.isHolderViewOnly = !this.isHolderViewOnly;
            if (btnToggleHolder) {
                if (this.isHolderViewOnly) {
                    btnToggleHolder.innerHTML = '<i class="fas fa-list"></i> View All Credentials';
                    btnToggleHolder.classList.remove('btn-outline');
                    btnToggleHolder.classList.add('btn-primary');
                    ToastManager.show('Filtering: Showing "My Credentials" (Holder View)', 'info', 2500);
                } else {
                    btnToggleHolder.innerHTML = '<i class="fas fa-user-graduate"></i> My Credentials (Holder View)';
                    btnToggleHolder.classList.remove('btn-primary');
                    btnToggleHolder.classList.add('btn-outline');
                    ToastManager.show('Viewing all institutional credentials', 'info', 2000);
                }
            }
            this.renderCredentialTable();
        });

        searchInput?.addEventListener('input', () => this.renderCredentialTable());
        statusFilter?.addEventListener('change', () => this.renderCredentialTable());

        btnOpenModal?.addEventListener('click', () => {
            if (modal) modal.style.display = 'flex';
            const issueInput = document.getElementById('credIssueDateInput');
            if (issueInput && !issueInput.value) {
                issueInput.value = new Date().toISOString().split('T')[0];
            }
        });

        const closeModal = () => { if (modal) modal.style.display = 'none'; };
        btnClose?.addEventListener('click', closeModal);
        btnCancel?.addEventListener('click', closeModal);

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const holder = document.getElementById('credHolderNameInput')?.value.trim();
            const holderId = document.getElementById('credHolderIdInput')?.value.trim();
            const title = document.getElementById('credTitleInput')?.value.trim();
            const profession = document.getElementById('credProfessionInput')?.value.trim();
            const skills = document.getElementById('credSkillsInput')?.value.trim();
            const issuer = document.getElementById('credIssuerOrgInput')?.value.trim();
            const grade = document.getElementById('credGradeInput')?.value.trim();
            const issueDate = document.getElementById('credIssueDateInput')?.value;
            const expiryDate = document.getElementById('credExpiryDateInput')?.value;
            const desc = document.getElementById('credDescInput')?.value.trim();

            const nextId = 'CRD-2026-' + String(Math.floor(100 + Math.random() * 900));
            const recordHash = await window.CoreCrypto.sha256Text(`${title}-${holder}-${issuer}-${issueDate}`);
            const txHash = window.CoreCrypto.generateTxHash();

            const record = {
                id: nextId,
                recordType: 'CREDENTIAL',
                title,
                issuer,
                holder,
                holderId,
                creationDate: new Date(issueDate).toISOString(),
                expiryDate: expiryDate ? new Date(expiryDate).toISOString() : '',
                status: 'ACTIVE',
                recordHash,
                txHash,
                blockNumber: Math.floor(6842500 + Math.random() * 5000),
                network: 'Sepolia (Simulated)',
                mode: 'demo',
                ipfsHash: window.CoreCrypto.generateIpfsCid(),
                metadata: {
                    profession,
                    skill: skills,
                    credentialTitle: title,
                    issuingOrganization: issuer,
                    grade: grade || 'Certified Competency Passed',
                    description: desc || 'Professional credential authenticated and anchored on CryptaCore ledger.'
                },
                auditHistory: [
                    {
                        eventId: 'EVT-' + Date.now().toString(36),
                        timestamp: new Date().toISOString(),
                        action: 'ISSUED',
                        actor: issuer,
                        actorRole: 'ISSUER',
                        details: `Professional credential awarded and anchored with SHA-256 digest.`,
                        txHash
                    }
                ]
            };

            window.CryptaCoreStore?.addRecord(record);
            form.reset();
            closeModal();
            ToastManager.show(`Credential ${record.id} minted successfully!`, 'success', 4000);
            this.renderCredentialTable();
            this.renderOverviewDashboard();
        });
    }

    renderCredentialTable() {
        if (!window.CryptaCoreStore) return;
        const store = window.CryptaCoreStore;
        let credentials = store.getRecordsByType('CREDENTIAL');

        const query = (document.getElementById('credentialSearchInput')?.value || '').toLowerCase().trim();
        const statusFilter = document.getElementById('credentialStatusFilter')?.value || 'ALL';

        if (this.isHolderViewOnly) {
            // Filter to holder persona (Marcus Sterling / Dr. Maya Lin)
            credentials = credentials.filter(c => c.holder.toLowerCase().includes('marcus') || c.holder.toLowerCase().includes('maya'));
        }

        if (statusFilter !== 'ALL') {
            credentials = credentials.filter(c => c.status === statusFilter);
        }

        if (query) {
            credentials = credentials.filter(c => {
                const idM = c.id && c.id.toLowerCase().includes(query);
                const titleM = c.title && c.title.toLowerCase().includes(query);
                const holderM = c.holder && c.holder.toLowerCase().includes(query);
                const profM = c.metadata?.profession && c.metadata.profession.toLowerCase().includes(query);
                const skillM = c.metadata?.skill && c.metadata.skill.toLowerCase().includes(query);
                return idM || titleM || holderM || profM || skillM;
            });
        }

        const tbody = document.getElementById('credentialsTableBody');
        if (!tbody) return;

        if (credentials.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <i class="fas fa-user-graduate fa-2x" style="opacity: 0.3; margin-bottom: 0.5rem; display: block;"></i>
                        No professional credentials found.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = credentials.map(c => {
            const statusBadge = window.UIComponents ? window.UIComponents.renderStatusBadge(c.status) : c.status;
            const expiryFormatted = c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Lifetime (No Expiry)';

            return `
                <tr>
                    <td><strong style="color: #8b5cf6; font-family: monospace;">${c.id}</strong></td>
                    <td>
                        <strong style="color: var(--text-primary); display: block;">${c.title}</strong>
                        ${c.metadata?.grade ? `<span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">${c.metadata.grade}</span>` : ''}
                    </td>
                    <td>
                        <div style="font-weight: 700;">${c.holder}</div>
                        ${c.holderId ? `<span style="font-size: 0.72rem; color: var(--text-secondary);">${c.holderId}</span>` : ''}
                    </td>
                    <td style="font-size: 0.82rem;">
                        <strong>${c.metadata?.profession || 'Specialist'}</strong>
                        <div style="font-size: 0.72rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${c.metadata?.skill || ''}</div>
                    </td>
                    <td style="font-size: 0.85rem; color: var(--text-primary);">${c.issuer}</td>
                    <td>${statusBadge}</td>
                    <td style="font-size: 0.82rem;">${expiryFormatted}</td>
                    <td>
                        <div class="table-action-btns">
                            <button class="btn-icon-action" title="View Full Details" onclick="certificateManager.viewUniversalRecord('${c.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon-action" title="Share Credential (Link & QR)" style="color: #8b5cf6;" onclick="certificateManager.openShareCredentialModal('${c.id}')">
                                <i class="fas fa-share-nodes"></i>
                            </button>
                            <button class="btn-icon-action" title="Verifier-Friendly View" style="color: #06b6d4;" onclick="certificateManager.openVerifierFriendlyModal('${c.id}')">
                                <i class="fas fa-shield-halved"></i>
                            </button>
                            <button class="btn-icon-action" title="Renew" onclick="certificateManager.promptRenewModal('${c.id}')">
                                <i class="fas fa-rotate"></i>
                            </button>
                            <button class="btn-icon-action" title="Revoke Credential" style="color: #ef4444;" onclick="certificateManager.promptRevokeRecordModal('${c.id}')">
                                <i class="fas fa-ban"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    setupOwnershipPortal() {
        const searchInput = document.getElementById('assetSearchInput');
        const btnOpenModal = document.getElementById('btnOpenRegisterAssetModal');
        const modal = document.getElementById('registerAssetModal');
        const btnClose = document.getElementById('btnCloseRegisterAssetModal');
        const btnCancel = document.getElementById('btnCancelRegisterAsset');
        const form = document.getElementById('registerAssetForm');

        searchInput?.addEventListener('input', () => this.renderOwnershipTable());

        btnOpenModal?.addEventListener('click', () => {
            if (modal) modal.style.display = 'flex';
        });

        const closeModal = () => { if (modal) modal.style.display = 'none'; };
        btnClose?.addEventListener('click', closeModal);
        btnCancel?.addEventListener('click', closeModal);

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('assetNameInput')?.value.trim();
            const type = document.getElementById('assetTypeSelect')?.value;
            const valuation = document.getElementById('assetValuationInput')?.value.trim();
            const creator = document.getElementById('assetCreatorInput')?.value.trim();
            const owner = document.getElementById('assetOwnerInput')?.value.trim();
            const desc = document.getElementById('assetDescInput')?.value.trim();

            const nextId = 'AST-2026-' + String(Math.floor(100 + Math.random() * 900));
            const recordHash = await window.CoreCrypto.sha256Text(`${name}-${creator}-${owner}`);
            const txHash = window.CoreCrypto.generateTxHash();

            const record = {
                id: nextId,
                recordType: 'DIGITAL_ASSET',
                title: name,
                issuer: 'World Intellectual Property & Innovation Registry',
                holder: owner,
                holderId: window.CoreCrypto.generateWalletAddress(),
                creationDate: new Date().toISOString(),
                expiryDate: '',
                status: 'ACTIVE',
                recordHash,
                txHash,
                blockNumber: Math.floor(6844000 + Math.random() * 5000),
                network: 'Sepolia (Simulated)',
                mode: 'demo',
                ipfsHash: window.CoreCrypto.generateIpfsCid(),
                metadata: {
                    assetName: name,
                    assetType: type,
                    creator,
                    currentOwner: owner,
                    valuationEstimate: valuation || '$1,000,000 USD',
                    description: desc || 'Digital title registered on CryptaCore Trust Layer.'
                },
                ownershipHistory: [
                    {
                        owner,
                        ownerAddress: window.CoreCrypto.generateWalletAddress(),
                        previousOwner: 'N/A (Creator)',
                        timestamp: new Date().toISOString(),
                        reason: 'Initial Asset Creation & Tokenized Title Registration',
                        txHash
                    }
                ],
                auditHistory: [
                    {
                        eventId: 'EVT-' + Date.now().toString(36),
                        timestamp: new Date().toISOString(),
                        action: 'REGISTERED',
                        actor: creator,
                        actorRole: 'HOLDER',
                        details: `Digital asset title minted and recorded.`,
                        txHash
                    }
                ]
            };

            window.CryptaCoreStore?.addRecord(record);
            form.reset();
            closeModal();
            ToastManager.show(`Asset ${record.id} registered on ledger!`, 'success', 4000);
            this.renderOwnershipTable();
            this.renderOverviewDashboard();
            this.displayAssetOwnershipTimeline(record.id);
        });

        // Setup Transfer Ownership Modal Form
        const transferModal = document.getElementById('transferOwnershipModal');
        const btnCloseTransfer = document.getElementById('btnCloseTransferModal');
        const btnCancelTransfer = document.getElementById('btnCancelTransfer');
        const transferForm = document.getElementById('transferOwnershipForm');

        const closeTransfer = () => { if (transferModal) transferModal.style.display = 'none'; };
        btnCloseTransfer?.addEventListener('click', closeTransfer);
        btnCancelTransfer?.addEventListener('click', closeTransfer);

        transferForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const assetId = document.getElementById('transferAssetIdInput')?.value;
            const newOwner = document.getElementById('transferNewOwnerInput')?.value.trim();
            const newOwnerAddr = document.getElementById('transferNewOwnerAddressInput')?.value.trim();
            const reason = document.getElementById('transferReasonInput')?.value.trim();

            const res = window.CryptaCoreStore?.transferOwnership(assetId, newOwner, reason, 'Authorized Title Holder', newOwnerAddr);
            if (res?.success) {
                closeTransfer();
                ToastManager.show(`Ownership of ${assetId} transferred to "${newOwner}"! Tx: ${res.txHash.substring(0, 14)}...`, 'success', 4500);
                this.renderOwnershipTable();
                this.renderOverviewDashboard();
                this.displayAssetOwnershipTimeline(assetId);
            } else {
                ToastManager.show(res?.error || 'Transfer failed', 'error', 3000);
            }
        });
    }

    renderOwnershipTable() {
        if (!window.CryptaCoreStore) return;
        const store = window.CryptaCoreStore;
        let assets = store.getRecordsByType('DIGITAL_ASSET');

        const query = (document.getElementById('assetSearchInput')?.value || '').toLowerCase().trim();
        if (query) {
            assets = assets.filter(a => {
                const idM = a.id && a.id.toLowerCase().includes(query);
                const titleM = a.title && a.title.toLowerCase().includes(query);
                const ownerM = a.holder && a.holder.toLowerCase().includes(query);
                const creatorM = a.metadata?.creator && a.metadata.creator.toLowerCase().includes(query);
                return idM || titleM || ownerM || creatorM;
            });
        }

        const tbody = document.getElementById('assetsTableBody');
        if (!tbody) return;

        if (assets.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <i class="fas fa-arrows-split-up-and-left fa-2x" style="opacity: 0.3; margin-bottom: 0.5rem; display: block;"></i>
                        No digital assets found.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = assets.map(a => {
            const statusBadge = window.UIComponents ? window.UIComponents.renderStatusBadge(a.status) : a.status;
            const historyCount = a.ownershipHistory ? a.ownershipHistory.length : 1;

            return `
                <tr>
                    <td><strong style="color: #06b6d4; font-family: monospace;">${a.id}</strong></td>
                    <td>
                        <strong style="color: var(--text-primary); display: block;">${a.title}</strong>
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">${a.metadata?.assetType || 'Digital Asset'}</span>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: #10b981;">${a.holder}</div>
                        <span style="font-size: 0.72rem; color: var(--text-secondary);">${historyCount} ownership events</span>
                    </td>
                    <td style="font-size: 0.85rem; color: var(--text-primary);">${a.metadata?.creator || 'Original Creator'}</td>
                    <td>${statusBadge}</td>
                    <td style="font-size: 0.85rem;">${new Date(a.creationDate).toLocaleDateString()}</td>
                    <td>
                        <div class="table-action-btns">
                            <button class="btn-icon-action" title="View Asset & Details" onclick="certificateManager.viewUniversalRecord('${a.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon-action" title="Transfer Ownership" style="color: #2563eb;" onclick="certificateManager.openTransferOwnershipModal('${a.id}')">
                                <i class="fas fa-arrow-right-arrow-left"></i>
                            </button>
                            <button class="btn-icon-action" title="Inspect Ownership Timeline" style="color: #06b6d4;" onclick="certificateManager.displayAssetOwnershipTimeline('${a.id}')">
                                <i class="fas fa-timeline"></i>
                            </button>
                            <button class="btn-icon-action" title="Verify on Blockchain" onclick="window.open('verify.html?id=${a.id}', '_blank')">
                                <i class="fas fa-check-double"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    displayAssetOwnershipTimeline(assetId) {
        const store = window.CryptaCoreStore;
        if (!store) return;

        const asset = store.getRecord(assetId);
        if (!asset || !asset.ownershipHistory) return;

        const card = document.getElementById('ownershipTimelineCard');
        const title = document.getElementById('ownershipTimelineAssetTitle');
        const body = document.getElementById('ownershipTimelineBody');

        if (title) title.textContent = `Chain of Custody for: ${asset.title} (${asset.id})`;
        if (body && window.UIComponents) {
            body.innerHTML = window.UIComponents.renderOwnershipTimeline(asset.ownershipHistory);
        }
        if (card) {
            card.style.display = 'block';
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    openTransferOwnershipModal(assetId) {
        const store = window.CryptaCoreStore;
        const asset = store?.getRecord(assetId);
        if (!asset) return;

        const modal = document.getElementById('transferOwnershipModal');
        const idInput = document.getElementById('transferAssetIdInput');
        const titleDisp = document.getElementById('transferAssetTitleDisplay');
        const ownerDisp = document.getElementById('transferCurrentOwnerDisplay');
        const newOwnerInput = document.getElementById('transferNewOwnerInput');
        const reasonInput = document.getElementById('transferReasonInput');

        if (idInput) idInput.value = asset.id;
        if (titleDisp) titleDisp.textContent = `${asset.title} (${asset.id})`;
        if (ownerDisp) ownerDisp.textContent = asset.holder;
        if (newOwnerInput) newOwnerInput.value = '';
        if (reasonInput) reasonInput.value = '';

        if (modal) modal.style.display = 'flex';
    }

    setupSupplyChainPortal() {
        const trackInput = document.getElementById('trackProductInput');
        const btnTrack = document.getElementById('btnTrackProduct');
        const btnOpenRegModal = document.getElementById('btnOpenRegisterProductModal');
        const regModal = document.getElementById('registerProductModal');
        const btnCloseReg = document.getElementById('btnCloseRegisterProductModal');
        const btnCancelReg = document.getElementById('btnCancelRegisterProduct');
        const regForm = document.getElementById('registerProductForm');

        const btnOpenEventModal = document.getElementById('btnOpenAddSupplyEventModal');
        const eventModal = document.getElementById('addSupplyEventModal');
        const btnCloseEvent = document.getElementById('btnCloseAddSupplyEventModal');
        const btnCancelEvent = document.getElementById('btnCancelAddSupplyEvent');
        const eventForm = document.getElementById('addSupplyEventForm');

        // Track Product handler
        const handleTrack = () => {
            const query = trackInput?.value.trim();
            if (!query) {
                ToastManager.show('Please enter a Product ID or Batch Number to track', 'warning', 2500);
                return;
            }
            this.trackProduct(query);
        };

        btnTrack?.addEventListener('click', handleTrack);
        trackInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleTrack(); });

        // Register Product Modal
        btnOpenRegModal?.addEventListener('click', () => {
            if (regModal) regModal.style.display = 'flex';
            const mfgDate = document.getElementById('prodMfgDateInput');
            if (mfgDate && !mfgDate.value) {
                mfgDate.value = new Date().toISOString().split('T')[0];
            }
        });

        const closeReg = () => { if (regModal) regModal.style.display = 'none'; };
        btnCloseReg?.addEventListener('click', closeReg);
        btnCancelReg?.addEventListener('click', closeReg);

        regForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('prodNameInput')?.value.trim();
            const batch = document.getElementById('prodBatchInput')?.value.trim();
            const manufacturer = document.getElementById('prodManufacturerInput')?.value.trim();
            const origin = document.getElementById('prodOriginInput')?.value.trim();
            const quantity = document.getElementById('prodQuantityInput')?.value.trim();
            const mfgDate = document.getElementById('prodMfgDateInput')?.value;
            const owner = document.getElementById('prodInitialOwnerInput')?.value.trim();
            const notes = document.getElementById('prodNotesInput')?.value.trim();

            const nextId = 'PRD-2026-' + String(Math.floor(100 + Math.random() * 900));
            const recordHash = await window.CoreCrypto.sha256Text(`${name}-${batch}-${manufacturer}`);
            const txHash = window.CoreCrypto.generateTxHash();

            const record = {
                id: nextId,
                recordType: 'SUPPLY_CHAIN',
                title: `${name} (Batch #${batch})`,
                issuer: manufacturer,
                holder: owner,
                holderId: window.CoreCrypto.generateWalletAddress(),
                creationDate: new Date(mfgDate).toISOString(),
                expiryDate: '',
                status: 'ACTIVE',
                currentStage: 'MANUFACTURED',
                recordHash,
                txHash,
                blockNumber: Math.floor(6844500 + Math.random() * 5000),
                network: 'Sepolia (Simulated)',
                mode: 'demo',
                ipfsHash: window.CoreCrypto.generateIpfsCid(),
                metadata: {
                    productName: name,
                    batchNumber: batch,
                    manufacturer,
                    manufacturingDate: mfgDate,
                    quantity: quantity || 'Standard Production Batch',
                    origin,
                    currentLocation: origin,
                    currentOwner: owner
                },
                supplyChainEvents: [
                    {
                        eventId: 'SC-EVT-' + Date.now().toString(36),
                        productId: nextId,
                        stage: 'MANUFACTURED',
                        actor: manufacturer,
                        location: origin,
                        timestamp: new Date().toISOString(),
                        previousOwner: 'N/A',
                        newOwner: owner,
                        temperature: 'Controlled Environment (21°C)',
                        eventHash: window.CoreCrypto.generateHash(),
                        txHash,
                        notes: notes || 'Production formulation complete. Quality benchmarks passed.'
                    }
                ],
                auditHistory: [
                    {
                        eventId: 'EVT-' + Date.now().toString(36),
                        timestamp: new Date().toISOString(),
                        action: 'MANUFACTURED',
                        actor: manufacturer,
                        actorRole: 'ISSUER',
                        details: `Product batch lot created and initialized on CryptaCore ledger.`,
                        txHash
                    }
                ]
            };

            window.CryptaCoreStore?.addRecord(record);
            regForm.reset();
            closeReg();
            ToastManager.show(`Product ${record.id} registered! Milestone 1 (MANUFACTURED) anchored.`, 'success', 4000);
            this.renderSupplyChainTable();
            this.renderOverviewDashboard();
            this.trackProduct(record.id);
        });

        // Add Supply Event Modal
        btnOpenEventModal?.addEventListener('click', () => {
            this.openAddSupplyEventModal();
        });

        const closeEvent = () => { if (eventModal) eventModal.style.display = 'none'; };
        btnCloseEvent?.addEventListener('click', closeEvent);
        btnCancelEvent?.addEventListener('click', closeEvent);

        eventForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const productId = document.getElementById('eventProductSelect')?.value;
            const stage = document.getElementById('eventStageSelect')?.value;
            const actor = document.getElementById('eventActorInput')?.value.trim();
            const location = document.getElementById('eventLocationInput')?.value.trim();
            const newOwner = document.getElementById('eventNewOwnerInput')?.value.trim();
            const temp = document.getElementById('eventTemperatureInput')?.value.trim();
            const notes = document.getElementById('eventNotesInput')?.value.trim();

            const res = window.CryptaCoreStore?.addSupplyChainEvent(productId, {
                stage,
                actor,
                location,
                newOwner,
                temperature: temp,
                notes
            });

            if (res?.success) {
                closeEvent();
                ToastManager.show(`Milestone "${stage}" anchored for ${productId}!`, 'success', 4000);
                this.renderSupplyChainTable();
                this.renderOverviewDashboard();
                this.trackProduct(productId);
            } else {
                ToastManager.show(res?.error || 'Failed to record event', 'error', 3000);
            }
        });
    }

    openAddSupplyEventModal(preselectedProductId = null) {
        const store = window.CryptaCoreStore;
        if (!store) return;

        const products = store.getRecordsByType('SUPPLY_CHAIN');
        const select = document.getElementById('eventProductSelect');
        const modal = document.getElementById('addSupplyEventModal');

        if (select) {
            select.innerHTML = products.map(p => `
                <option value="${p.id}" ${preselectedProductId === p.id ? 'selected' : ''}>
                    ${p.id} - ${p.title} (Current: ${p.currentStage || 'MANUFACTURED'})
                </option>
            `).join('');
        }

        if (modal) modal.style.display = 'flex';
    }

    trackProduct(productIdOrQuery) {
        const store = window.CryptaCoreStore;
        if (!store) return;

        const product = store.getRecord(productIdOrQuery);
        if (!product || product.recordType !== 'SUPPLY_CHAIN') {
            ToastManager.show(`No supply chain product found for: "${productIdOrQuery}"`, 'error', 3000);
            return;
        }

        const card = document.getElementById('supplyChainStepperCard');
        const title = document.getElementById('stepperProductTitle');
        const subtitle = document.getElementById('stepperProductSubtitle');
        const display = document.getElementById('supplyChainStepperDisplay');
        const logs = document.getElementById('supplyChainMilestoneLogs');

        if (title) title.innerHTML = `<i class="fas fa-route text-cyan"></i> Provenance Chain: ${product.title}`;
        if (subtitle) subtitle.innerHTML = `<strong>Product ID:</strong> ${product.id} • <strong>Current Custodian:</strong> ${product.holder} • <strong>Location:</strong> ${product.metadata?.currentLocation || 'In Transit'}`;

        if (display && window.UIComponents) {
            display.innerHTML = window.UIComponents.renderSupplyChainStepper(product.supplyChainEvents, product.currentStage);
        }

        if (logs) {
            const events = product.supplyChainEvents || [];
            logs.innerHTML = `
                <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-primary);">
                    <i class="fas fa-clipboard-list text-primary"></i> Checkpoint Audit Log (${events.length} milestones recorded)
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem;">
                    ${events.map(e => `
                        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem; font-size: 0.82rem;">
                            <div style="display: flex; justify-content: space-between; font-weight: 800; color: #06b6d4; margin-bottom: 0.3rem;">
                                <span>${e.stage}</span>
                                <span style="color: var(--text-secondary); font-size: 0.75rem;">${new Date(e.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div><strong>Location:</strong> ${e.location}</div>
                            <div><strong>Inspector/Entity:</strong> ${e.actor}</div>
                            ${e.temperature ? `<div><strong>Reading:</strong> ${e.temperature}</div>` : ''}
                            ${e.notes ? `<div style="margin-top: 0.3rem; color: var(--text-secondary); font-style: italic;">"${e.notes}"</div>` : ''}
                            <div style="font-family: monospace; font-size: 0.7rem; color: var(--primary-color); word-break: break-all; margin-top: 0.4rem;">
                                Event Hash: ${e.eventHash ? e.eventHash.substring(0, 20) + '...' : '0x...'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        if (card) {
            card.style.display = 'block';
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    renderSupplyChainTable() {
        if (!window.CryptaCoreStore) return;
        const store = window.CryptaCoreStore;
        const products = store.getRecordsByType('SUPPLY_CHAIN');
        const tbody = document.getElementById('supplyChainTableBody');
        if (!tbody) return;

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <i class="fas fa-truck-ramp-box fa-2x" style="opacity: 0.3; margin-bottom: 0.5rem; display: block;"></i>
                        No supply chain records found.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = products.map(p => {
            const statusBadge = window.UIComponents ? window.UIComponents.renderStatusBadge(p.status) : p.status;
            const currentStage = p.currentStage || 'MANUFACTURED';

            return `
                <tr>
                    <td><strong style="color: #f59e0b; font-family: monospace;">${p.id}</strong></td>
                    <td>
                        <strong style="color: var(--text-primary); display: block;">${p.title}</strong>
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">Batch: ${p.metadata?.batchNumber || 'N/A'}</span>
                    </td>
                    <td>
                        <div style="font-weight: 600;">${p.issuer}</div>
                        <span style="font-size: 0.72rem; color: var(--text-secondary);">${p.metadata?.origin || ''}</span>
                    </td>
                    <td style="font-size: 0.85rem; color: var(--text-primary);">${p.metadata?.currentLocation || 'Logistics Terminal'}</td>
                    <td style="font-size: 0.85rem; font-weight: 600;">${p.holder}</td>
                    <td>
                        <span style="background: rgba(6, 182, 212, 0.15); color: #06b6d4; border: 1px solid #06b6d450; padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 800;">
                            <i class="fas fa-circle-dot"></i> ${currentStage}
                        </span>
                    </td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="table-action-btns">
                            <button class="btn-icon-action" title="Track Provenance Stepper" style="color: #06b6d4;" onclick="certificateManager.trackProduct('${p.id}')">
                                <i class="fas fa-route"></i>
                            </button>
                            <button class="btn-icon-action" title="Add Next Milestone" style="color: #10b981;" onclick="certificateManager.openAddSupplyEventModal('${p.id}')">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn-icon-action" title="View Full Ledger" onclick="certificateManager.viewUniversalRecord('${p.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon-action" title="Verify Portal" onclick="window.open('verify.html?id=${p.id}', '_blank')">
                                <i class="fas fa-check-double"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    setupUniversalModals() {
        // Universal Record Modal close
        const univModal = document.getElementById('universalRecordModal');
        document.getElementById('btnCloseUniversalModal')?.addEventListener('click', () => { if (univModal) univModal.style.display = 'none'; });
        document.getElementById('btnCloseUniversalBtn')?.addEventListener('click', () => { if (univModal) univModal.style.display = 'none'; });

        // Share Credential Modal close & copy
        const shareModal = document.getElementById('shareCredentialModal');
        document.getElementById('btnCloseShareCredentialModal')?.addEventListener('click', () => { if (shareModal) shareModal.style.display = 'none'; });
        document.getElementById('btnCopyShareUrl')?.addEventListener('click', () => {
            const inp = document.getElementById('shareUrlInput');
            if (inp?.value) {
                navigator.clipboard.writeText(inp.value);
                ToastManager.show('Verification link copied to clipboard!', 'success', 2500);
            }
        });

        // Verifier Friendly Modal close
        const verifModal = document.getElementById('verifierFriendlyModal');
        document.getElementById('btnCloseVerifierFriendlyModal')?.addEventListener('click', () => { if (verifModal) verifModal.style.display = 'none'; });
        document.getElementById('btnCloseVerifierBtn')?.addEventListener('click', () => { if (verifModal) verifModal.style.display = 'none'; });

        // Renew Record Modal Form
        const renewModal = document.getElementById('renewRecordModal');
        document.getElementById('btnCloseRenewModal')?.addEventListener('click', () => { if (renewModal) renewModal.style.display = 'none'; });
        document.getElementById('btnCancelRenew')?.addEventListener('click', () => { if (renewModal) renewModal.style.display = 'none'; });

        document.getElementById('renewRecordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const recId = document.getElementById('renewRecordIdInput')?.value;
            const newExpiry = document.getElementById('renewNewExpiryInput')?.value;
            const actor = document.getElementById('renewActorInput')?.value.trim() || 'Admin Authority';

            const res = window.CryptaCoreStore?.renewRecord(recId, newExpiry, actor);
            if (res?.success) {
                if (renewModal) renewModal.style.display = 'none';
                ToastManager.show(`Record ${recId} renewed until ${new Date(newExpiry).toLocaleDateString()}! Tx: ${res.txHash.substring(0, 12)}...`, 'success', 4000);
                this.renderOverviewDashboard();
                this.renderLicenseTable();
                this.renderCredentialTable();
            } else {
                ToastManager.show(res?.error || 'Failed to renew', 'error', 3000);
            }
        });
    }

    viewUniversalRecord(recordId) {
        const store = window.CryptaCoreStore;
        if (!store) return;

        const record = store.getRecord(recordId);
        if (!record) {
            ToastManager.show(`Record not found: ${recordId}`, 'error', 2500);
            return;
        }

        const modal = document.getElementById('universalRecordModal');
        const titleEl = document.getElementById('universalModalTitle');
        const bodyEl = document.getElementById('universalModalBody');
        const verifyBtn = document.getElementById('btnUniversalOpenVerify');

        if (titleEl) {
            titleEl.innerHTML = `<i class="fas fa-file-contract text-primary"></i> ${record.recordType} Details: ${record.id}`;
        }

        if (verifyBtn) {
            verifyBtn.href = `verify.html?id=${record.id}`;
        }

        if (bodyEl && window.UIComponents) {
            const statusBadge = window.UIComponents.renderStatusBadge(record.status);
            const proofBox = window.UIComponents.renderBlockchainProof(record);
            const auditTimeline = window.UIComponents.renderAuditTimeline(record.auditHistory);

            bodyEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                    <div>
                        <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Record Classification</span>
                        <h3 style="margin: 0; color: var(--text-primary); font-size: 1.25rem;">${record.title}</h3>
                    </div>
                    ${statusBadge}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; font-size: 0.88rem;">
                    <div>
                        <span style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase;">Holder / Custodian:</span>
                        <div style="font-weight: 700; color: var(--text-primary);">${record.holder} ${record.holderId ? `(${record.holderId})` : ''}</div>
                    </div>
                    <div>
                        <span style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase;">Issuing Entity:</span>
                        <div style="font-weight: 600; color: var(--text-primary);">${record.issuer}</div>
                    </div>
                    <div>
                        <span style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase;">Issue / Registration Date:</span>
                        <div>${new Date(record.creationDate).toLocaleString()}</div>
                    </div>
                    <div>
                        <span style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase;">Expiry Date:</span>
                        <div>${record.expiryDate ? new Date(record.expiryDate).toLocaleDateString() : 'Permanent (No Expiry)'}</div>
                    </div>
                </div>

                ${record.revokeReason ? `
                    <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 0.85rem; border-radius: 6px; margin-bottom: 1rem;">
                        <strong style="color: #ef4444;"><i class="fas fa-ban"></i> Revocation Notice:</strong>
                        <p style="margin: 0.2rem 0 0; font-size: 0.85rem;">${record.revokeReason}</p>
                    </div>
                ` : ''}

                <!-- Cryptographic Proof Box -->
                ${proofBox}

                <!-- Audit Timeline -->
                <h4 style="font-size: 0.95rem; margin: 1.5rem 0 0.5rem; color: var(--text-primary);">
                    <i class="fas fa-timeline text-primary"></i> Complete Chronological Audit History
                </h4>
                ${auditTimeline}
            `;
        }

        if (modal) modal.style.display = 'flex';
    }

    openShareCredentialModal(recordId) {
        const store = window.CryptaCoreStore;
        const record = store?.getRecord(recordId);
        if (!record) return;

        const modal = document.getElementById('shareCredentialModal');
        const urlInput = document.getElementById('shareUrlInput');
        const linkBtn = document.getElementById('btnOpenShareVerifyLink');
        const qrContainer = document.getElementById('shareQrDisplay');

        const baseUrl = window.location.href.split('admin.html')[0] + 'verify.html?id=' + encodeURIComponent(record.id);

        if (urlInput) urlInput.value = baseUrl;
        if (linkBtn) linkBtn.href = baseUrl;

        if (qrContainer) {
            qrContainer.innerHTML = '';
            if (typeof QRCode !== 'undefined') {
                new QRCode(qrContainer, {
                    text: baseUrl,
                    width: 180,
                    height: 180,
                    colorDark: '#0f172a',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        }

        if (modal) modal.style.display = 'flex';
    }

    openVerifierFriendlyModal(recordId) {
        const store = window.CryptaCoreStore;
        const record = store?.getRecord(recordId);
        if (!record) return;

        const modal = document.getElementById('verifierFriendlyModal');
        const bodyEl = document.getElementById('verifierFriendlyBody');

        if (bodyEl) {
            const isRevoked = record.status === 'REVOKED';
            const isExpired = record.expiryDate && new Date(record.expiryDate) < new Date();
            const badgeColor = isRevoked ? '#ef4444' : (isExpired ? '#f59e0b' : '#10b981');
            const badgeText = isRevoked ? 'REVOKED' : (isExpired ? 'EXPIRED' : 'AUTHENTIC & VERIFIED');

            bodyEl.innerHTML = `
                <div style="border: 2px solid ${badgeColor}; border-radius: 12px; padding: 2rem; background: var(--bg-secondary); position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 1rem; right: 1rem; background: ${badgeColor}20; color: ${badgeColor}; border: 2px solid ${badgeColor}; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.85rem; border-radius: 9999px; text-transform: uppercase;">
                        ✓ ${badgeText}
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 800; letter-spacing: 1px;">CryptaCore Trust Layer Verification</span>
                        <h2 style="font-size: 1.6rem; color: var(--text-primary); margin: 0.35rem 0;">${record.title}</h2>
                        <div style="color: var(--primary-color); font-weight: 700;">${record.issuer}</div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.9rem;">
                        <div>
                            <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Holder / Recipient:</span>
                            <div style="font-weight: 700; color: var(--text-primary);">${record.holder}</div>
                        </div>
                        <div>
                            <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Credential ID:</span>
                            <div style="font-weight: 800; color: var(--primary-color); font-family: monospace;">${record.id}</div>
                        </div>
                        <div>
                            <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Valid From:</span>
                            <div>${new Date(record.creationDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Validity Expiry:</span>
                            <div>${record.expiryDate ? new Date(record.expiryDate).toLocaleDateString() : 'Permanent'}</div>
                        </div>
                    </div>

                    <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-size: 0.8rem;">
                        <span style="color: var(--text-secondary); text-transform: uppercase; font-size: 0.7rem; font-weight: 700;">Blockchain Cryptographic Fingerprint</span>
                        <code style="display: block; word-break: break-all; color: var(--primary-color); margin: 0.3rem 0; font-family: monospace;">${record.recordHash}</code>
                        <div style="color: #10b981; font-weight: 700; font-size: 0.75rem;"><i class="fas fa-shield-halved"></i> Verified on Ethereum Sepolia Trust Ledger</div>
                    </div>

                    <div style="margin-top: 1.25rem; font-size: 0.75rem; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-user-lock"></i>
                        <span>Selective Disclosure Active: Personal contact information and private grade transcripts are withheld under zero-knowledge compliance.</span>
                    </div>
                </div>
            `;
        }

        if (modal) modal.style.display = 'flex';
    }

    promptRenewModal(recordId) {
        const store = window.CryptaCoreStore;
        const record = store?.getRecord(recordId);
        if (!record) return;

        const modal = document.getElementById('renewRecordModal');
        const idInput = document.getElementById('renewRecordIdInput');
        const titleDisp = document.getElementById('renewRecordTitleDisplay');
        const expiryInput = document.getElementById('renewNewExpiryInput');

        if (idInput) idInput.value = record.id;
        if (titleDisp) titleDisp.textContent = `${record.title} (${record.id})`;

        if (expiryInput) {
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 2);
            expiryInput.value = nextYear.toISOString().split('T')[0];
        }

        if (modal) modal.style.display = 'flex';
    }

    promptRevokeRecordModal(recordId) {
        this.currentRevokeRecordId = recordId;
        const record = window.CryptaCoreStore?.getRecord(recordId);

        const modal = document.getElementById('revokeModal');
        const summary = document.getElementById('revokeRecordSummary');
        const reasonInput = document.getElementById('revokeReasonInput');

        if (summary && record) {
            summary.innerHTML = `
                <div style="margin-top: 0.5rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: 6px; font-size: 0.85rem;">
                    <strong>Target Record:</strong> ${record.title} (${record.id})<br>
                    <strong>Holder:</strong> ${record.holder}
                </div>
            `;
        }
        if (reasonInput) reasonInput.value = '';
        if (modal) modal.style.display = 'flex';
    }

    openQrForRecord(recordId) {
        const record = window.CryptaCoreStore?.getRecord(recordId);
        if (!record) return;

        // If it's a certificate, use existing QR modal
        this.showQrModal(record.id);
    }
    loadRecords() {
        try {
            const data = localStorage.getItem(BLOCKCHAIN_CONFIG.storageKey);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('Failed to load storage:', e);
        }
        // Return default sample records
        return JSON.parse(JSON.stringify(DEFAULT_SAMPLE_RECORDS));
    }

    saveRecords() {
        try {
            localStorage.setItem(BLOCKCHAIN_CONFIG.storageKey, JSON.stringify(this.records));
        } catch (e) {
            console.error('Failed to save storage:', e);
        }
    }

    updateStats() {
        const total = this.records.length;
        let valid = 0;
        let revoked = 0;
        let anchored = total;

        const now = new Date();
        this.records.forEach(r => {
            const isExpired = r.expiryDate && new Date(r.expiryDate) < now;
            if (r.status === 'revoked' || isExpired) {
                revoked++;
            } else {
                valid++;
            }
        });

        const totalEl = document.getElementById('statTotalIssued');
        const anchoredEl = document.getElementById('statAnchored');
        const validEl = document.getElementById('statValid');
        const revokedEl = document.getElementById('statRevoked');
        const badgeEl = document.getElementById('registryCountBadge');

        if (totalEl) totalEl.textContent = total;
        if (anchoredEl) anchoredEl.textContent = anchored;
        if (validEl) validEl.textContent = valid;
        if (revokedEl) revokedEl.textContent = revoked;
        if (badgeEl) badgeEl.textContent = total;
    }
}

// Global instance initialization
let certificateManager;
window.addEventListener('DOMContentLoaded', () => {
    certificateManager = new CertificateAuthorityManager();
    window.certificateManager = certificateManager;
});
