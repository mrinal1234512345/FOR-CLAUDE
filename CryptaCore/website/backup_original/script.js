// ========================================
// NAVIGATION & MOBILE MENU
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        updateActiveLink();
    });
});

// Update active link based on scroll position
window.addEventListener('scroll', updateActiveLink);

function updateActiveLink() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll helper
function scrollTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================================
// BLOCKCHAIN & CRYPTOGRAPHY UTILITIES
// ========================================

const BLOCKCHAIN_CONFIG = {
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    chainId: 11155111,
    contractAddress: '0x0000000000000000000000000000000000000000',
    mode: 'demo'
};

const CRYPTACORE_CONTRACT_ABI = [
    'function registerRecord(bytes32 _recordHash, address _recordOwner, string _recordType, string _ipfsHash) returns (bool)',
    'function verifyRecord(bytes32 _recordHash) view returns (bool)',
    'function revokeRecord(bytes32 _recordHash) returns (bool)',
    'function transferRecord(bytes32 _recordHash, address _newOwner, string _reason) returns (bool)',
    'function recordCount() view returns (uint256)'
];

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

function updateBlockchainStatus(message, isError = false) {
    const statusEl = document.getElementById('blockchainStatus');
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#b91c1c' : '#475569';
    statusEl.style.fontWeight = '600';
}

const BlockchainService = {
    provider: null,
    signer: null,
    contract: null,
    connected: false,

    isConfigured() {
        return !!BLOCKCHAIN_CONFIG.contractAddress && BLOCKCHAIN_CONFIG.contractAddress !== ZERO_ADDRESS;
    },

    async connectWallet() {
        if (typeof window === 'undefined' || !window.ethereum) {
            updateBlockchainStatus('MetaMask not detected. Install a wallet to use the live blockchain path.', true);
            return false;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            this.provider = provider;
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const signer = await provider.getSigner();
            this.signer = signer;
            const network = await provider.getNetwork();

            if (Number(network.chainId) !== BLOCKCHAIN_CONFIG.chainId) {
                updateBlockchainStatus('Wallet is connected, but switch it to Sepolia testnet to register on-chain.', true);
                this.connected = false;
                return false;
            }

            this.connected = true;
            updateBlockchainStatus('Wallet connected. Live Sepolia blockchain is ready.');
            return true;
        } catch (error) {
            console.error('Wallet connection failed:', error);
            updateBlockchainStatus('Wallet connection was cancelled or failed. Demo mode remains active.', true);
            return false;
        }
    },

    async ensureLiveContract() {
        if (!this.isConfigured()) {
            return null;
        }

        if (!this.provider) {
            if (!window.ethereum) {
                return null;
            }
            this.provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);
        }

        if (!this.contract) {
            this.contract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, CRYPTACORE_CONTRACT_ABI, this.provider);
        }

        if (window.ethereum && !this.connected) {
            const walletConnected = await this.connectWallet();
            if (!walletConnected) {
                return null;
            }
        }

        if (this.signer) {
            this.contract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, CRYPTACORE_CONTRACT_ABI, this.signer);
        }

        return this.contract;
    },

    async registerOnChain(record) {
        if (!this.isConfigured()) {
            return { mode: 'demo', reason: 'No contract configured yet.' };
        }

        if (!window.ethereum) {
            return { mode: 'demo', reason: 'MetaMask is not installed.' };
        }

        const contract = await this.ensureLiveContract();
        if (!contract || !this.signer) {
            return { mode: 'demo', reason: 'Wallet not connected.' };
        }

        try {
            const ownerAddress = await this.signer.getAddress();
            const tx = await contract.registerRecord(record.recordHash, ownerAddress, record.type, 'ipfs://cryptacore-demo');
            const receipt = await tx.wait();

            return {
                mode: 'live',
                txHash: receipt.hash,
                blockNumber: Number(receipt.blockNumber),
                network: 'Sepolia',
                ownerAddress
            };
        } catch (error) {
            console.error('On-chain registration failed:', error);
            return { mode: 'demo', reason: error.message || 'Blockchain transaction was rejected.' };
        }
    },

    async verifyOnChain(recordHash) {
        if (!this.isConfigured()) {
            return { mode: 'demo', valid: false };
        }

        try {
            const contract = await this.ensureLiveContract();
            if (!contract) {
                return { mode: 'demo', valid: false };
            }
            const valid = await contract.verifyRecord(recordHash);
            return { mode: 'live', valid };
        } catch (error) {
            console.error('On-chain verification failed:', error);
            return { mode: 'demo', valid: false };
        }
    }
};

class CryptoUtil {
    static async generateHash(data) {
        const dataString = JSON.stringify(data);
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(dataString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return '0x' + hashHex;
    }

    static generateBlockchainAddress() {
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
            address += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return address;
    }

    static getCurrentBlockHash() {
        const timestamp = Date.now();
        const nonce = Math.floor(Math.random() * 1000000);
        const combined = `${timestamp}${nonce}`;
        let hash = '0x';
        for (let i = 0; i < 16; i++) {
            const charCode = combined.charCodeAt(i % combined.length);
            hash += charCode.toString(16);
        }
        return hash;
    }
}

// ========================================
// DEMO FUNCTIONALITY
// ========================================

const recordForm = document.getElementById('recordForm');
const demoOutput = document.getElementById('demoOutput');

// Store records for verification
let registeredRecords = JSON.parse(localStorage.getItem('cryptacoreRecords')) || [];

recordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const recordType = document.getElementById('recordType').value;
    const recipientName = document.getElementById('recipientName').value;
    const issuerName = document.getElementById('issuerName').value;
    const recordDetails = document.getElementById('recordDetails').value;

    const record = {
        id: Date.now(),
        type: recordType,
        recipient: recipientName,
        issuer: issuerName,
        details: recordDetails,
        timestamp: new Date().toLocaleString(),
        issuerAddress: CryptoUtil.generateBlockchainAddress(),
        recipientAddress: CryptoUtil.generateBlockchainAddress(),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        txHash: null,
        recordHash: null,
        status: 'Processing...'
    };

    const hash = await CryptoUtil.generateHash({
        type: recordType,
        recipient: recipientName,
        issuer: issuerName,
        details: recordDetails,
        timestamp: record.timestamp
    });
    record.recordHash = hash;
    record.txHash = CryptoUtil.getCurrentBlockHash();

    const onChainResult = await BlockchainService.registerOnChain(record);

    if (onChainResult.mode === 'live') {
        record.blockNumber = onChainResult.blockNumber;
        record.txHash = onChainResult.txHash;
        record.issuerAddress = onChainResult.ownerAddress || record.issuerAddress;
        record.status = 'Verified on live Sepolia blockchain';
        updateBlockchainStatus(`Live blockchain registration successful. Tx: ${record.txHash}`);
    } else {
        record.status = 'Verified on local demo ledger';
        updateBlockchainStatus(`Blockchain not active yet. Falling back to demo ledger: ${onChainResult.reason || 'demo mode'}`);
    }

    registeredRecords.push(record);
    localStorage.setItem('cryptacoreRecords', JSON.stringify(registeredRecords));

    displayRecordResult(record);
    recordForm.reset();
});

function displayRecordResult(record) {
    const resultHTML = `
        <div class="record-result">
            <h4>✓ Record Successfully Registered!</h4>
            <div class="detail">
                <span class="label">Record Type:</span>
                <span class="value">${capitalizeText(record.type)}</span>
            </div>
            <div class="detail">
                <span class="label">Recipient:</span>
                <span class="value">${record.recipient}</span>
            </div>
            <div class="detail">
                <span class="label">Issuer:</span>
                <span class="value">${record.issuer}</span>
            </div>
            <div class="detail">
                <span class="label">Record Hash:</span>
                <span class="value">${record.recordHash}</span>
            </div>
            <div class="detail">
                <span class="label">Transaction Hash:</span>
                <span class="value">${record.txHash}</span>
            </div>
            <div class="detail">
                <span class="label">Blockchain Block:</span>
                <span class="value">#${record.blockNumber}</span>
            </div>
            <div class="detail">
                <span class="label">Issuer Address:</span>
                <span class="value">${record.issuerAddress}</span>
            </div>
            <div class="detail">
                <span class="label">Recipient Address:</span>
                <span class="value">${record.recipientAddress}</span>
            </div>
            <div class="detail">
                <span class="label">Timestamp:</span>
                <span class="value">${record.timestamp}</span>
            </div>
            <div class="detail">
                <span class="label">Status:</span>
                <span class="value" style="color: #10b981; font-weight: bold;">✓ ${record.status}</span>
            </div>
            <div class="detail">
                <span class="label">Details:</span>
                <span class="value">${record.details}</span>
            </div>
        </div>
    `;

    demoOutput.innerHTML = resultHTML + (demoOutput.innerHTML === '<p class="placeholder-text">Submit a record above to see blockchain hash...</p>' ? '' : demoOutput.innerHTML);
}

// ========================================
// VERIFICATION FUNCTIONALITY (STRICT)
// ========================================

async function verifyRecord() {
    const hashInput = document.getElementById('verifyHash').value.trim();
    const verifyOutput = document.getElementById('verifyOutput');

    if (!hashInput) {
        verifyOutput.innerHTML = '<p class="error-message">❌ Please enter a record hash to verify.</p>';
        verifyOutput.classList.add('show');
        return;
    }

    if (!hashInput.startsWith('0x')) {
        verifyOutput.innerHTML = '<p class="error-message">❌ Invalid hash format. Hash must start with "0x"</p>';
        verifyOutput.classList.add('show');
        return;
    }

    const currentRecords = JSON.parse(localStorage.getItem('cryptacoreRecords')) || [];
    const record = currentRecords.find(r => r.recordHash === hashInput);

    if (BlockchainService.isConfigured()) {
        const onChainResult = await BlockchainService.verifyOnChain(hashInput);
        if (onChainResult.mode === 'live' && onChainResult.valid) {
            const lookupRecord = currentRecords.find(r => r.recordHash === hashInput) || {
                type: 'credential',
                recipient: 'Wallet Owner',
                issuer: 'Verified Institution',
                details: 'Verified on Sepolia blockchain',
                timestamp: new Date().toLocaleString(),
                issuerAddress: 'On-chain verified',
                recipientAddress: 'On-chain verified',
                txHash: 'On-chain transaction',
                blockNumber: 'Live network'
            };

            const verificationResult = `
                <div class="verify-result valid">
                    <h4>✓ Record Verified Successfully!</h4>
                    <p style="color: #10b981; font-weight: bold; margin-bottom: 1rem;">This record is authentic and was confirmed on the live Sepolia blockchain.</p>
                    <div class="detail"><span class="label">Record Type:</span><span>${capitalizeText(lookupRecord.type)}</span></div>
                    <div class="detail"><span class="label">Recipient:</span><span>${lookupRecord.recipient}</span></div>
                    <div class="detail"><span class="label">Issuer:</span><span>${lookupRecord.issuer}</span></div>
                    <div class="detail"><span class="label">Record Hash (Verified):</span><span>${hashInput}</span></div>
                    <div class="detail"><span class="label">Blockchain Status:</span><span style="color: #10b981; font-weight: bold;">✅ Immutable & Verified</span></div>
                    <div class="detail"><span class="label">Tx Hash:</span><span>${lookupRecord.txHash || 'Live Ethereum transaction'}</span></div>
                    <div class="detail"><span class="label">Block:</span><span>${lookupRecord.blockNumber || 'On-chain'}</span></div>
                    <div class="detail"><span class="label">Registered Time:</span><span>${lookupRecord.timestamp}</span></div>
                    <div class="detail"><span class="label">Record Details:</span><span>${lookupRecord.details}</span></div>
                </div>
            `;
            verifyOutput.innerHTML = verificationResult;
            verifyOutput.classList.add('show');
            return;
        }
    }

    if (record) {
        const verificationResult = `
            <div class="verify-result valid">
                <h4>✓ Record Verified Successfully!</h4>
                <p style="color: #10b981; font-weight: bold; margin-bottom: 1rem;">This record is AUTHENTIC and registered in the demo ledger.</p>
                <div class="detail"><span class="label">Record Type:</span><span>${capitalizeText(record.type)}</span></div>
                <div class="detail"><span class="label">Recipient:</span><span>${record.recipient}</span></div>
                <div class="detail"><span class="label">Issuer:</span><span>${record.issuer}</span></div>
                <div class="detail"><span class="label">Record Hash (Verified):</span><span>${record.recordHash}</span></div>
                <div class="detail"><span class="label">Blockchain Status:</span><span style="color: #10b981; font-weight: bold;">✅ Immutable & Verified</span></div>
                <div class="detail"><span class="label">Transaction Hash:</span><span>${record.txHash}</span></div>
                <div class="detail"><span class="label">Block Number:</span><span>#${record.blockNumber}</span></div>
                <div class="detail"><span class="label">Registered Time:</span><span>${record.timestamp}</span></div>
                <div class="detail"><span class="label">Issuer Wallet:</span><span>${record.issuerAddress}</span></div>
                <div class="detail"><span class="label">Owner Wallet:</span><span>${record.recipientAddress}</span></div>
                <div class="detail"><span class="label">Record Details:</span><span>${record.details}</span></div>
            </div>
        `;
        verifyOutput.innerHTML = verificationResult;
    } else {
        const verificationResult = `
            <div class="verify-result invalid">
                <h4>❌ Record Not Found or Invalid</h4>
                <p style="color: #991b1b; font-weight: bold; margin-bottom: 1rem;">This hash does NOT exist on the blockchain.</p>
                <p>This could mean:</p>
                <ul style="margin-top: 1rem; margin-left: 1.5rem; color: #991b1b;">
                    <li><strong>Hash not registered:</strong> You haven't registered this hash yet</li>
                    <li><strong>Hash tampered:</strong> The hash has been modified or corrupted</li>
                    <li><strong>Wrong hash:</strong> You may have entered an incorrect hash</li>
                    <li><strong>Record revoked:</strong> The record may have been revoked</li>
                </ul>
                <p style="margin-top: 1rem; color: #991b1b;"><strong>✓ Solution:</strong> Register a new record above and then verify the hash you receive.</p>
            </div>
        `;
        verifyOutput.innerHTML = verificationResult;
    }

    verifyOutput.classList.add('show');
}

// ========================================
// FORM HANDLING
// ========================================

const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // In a real application, this would send data to a backend
    const formData = new FormData(contactForm);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = '✓ Message sent successfully! We\'ll get back to you soon.';
    contactForm.parentElement.insertBefore(successMessage, contactForm);
    
    // Reset form
    contactForm.reset();
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

function capitalizeText(text) {
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Debug function to view all registered records
function viewRegisteredRecords() {
    const records = JSON.parse(localStorage.getItem('cryptacoreRecords')) || [];
    console.clear();
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 CRYPTACORE REGISTERED RECORDS');
    console.log('═══════════════════════════════════════════════════════');
    
    if (records.length === 0) {
        console.log('❌ No records registered yet');
    } else {
        records.forEach((rec, i) => {
            console.log(`\n✅ Record #${i+1}`);
            console.log(`   Type:       ${capitalizeText(rec.type)}`);
            console.log(`   Recipient:  ${rec.recipient}`);
            console.log(`   Issuer:     ${rec.issuer}`);
            console.log(`   Hash:       ${rec.recordHash} ← COPY THIS FOR VERIFICATION`);
            console.log(`   TX Hash:    ${rec.txHash}`);
            console.log(`   Block:      #${rec.blockNumber}`);
            console.log(`   Timestamp:  ${rec.timestamp}`);
            console.log(`   Details:    ${rec.details}`);
        });
    }
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('💡 Copy any hash above and paste in Verify section');
    console.log('═══════════════════════════════════════════════════════');
}

// Clear all records
function clearAllRecords() {
    if (confirm('⚠️  Clear all registered records? This cannot be undone.')) {
        localStorage.removeItem('cryptacoreRecords');
        registeredRecords = [];
        console.log('✅ All records cleared');
    }
}

// Initialize demo - NO fake sample data, start fresh
function initializeDemoWithSamples() {
    // Start with empty records - users must register their own
    registeredRecords = [];
    localStorage.removeItem('cryptacoreRecords');
    
    // Show helpful message
    console.log('ℹ️  CryptaCore Demo initialized.');
    console.log('📝 Register your own records to test verification.');
    console.log('⚠️  Only records YOU register will verify as valid.');
}

// ========================================
// PAGE LOAD & INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    initializeDemoWithSamples();
    updateActiveLink();

    if (typeof ethers !== 'undefined' && window.ethereum) {
        const hasWallet = await BlockchainService.connectWallet();
        if (!hasWallet) {
            updateBlockchainStatus('Demo mode active: install MetaMask or connect a wallet to use the live blockchain flow.', false);
        }
    } else {
        updateBlockchainStatus('Demo mode active: browser storage enabled. Connect MetaMask to use live Sepolia blockchain.', false);
    }
    
    const storedRecords = JSON.parse(localStorage.getItem('cryptacoreRecords')) || [];
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 CryptaCore Demo Initialized');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 Currently Registered Records: ' + storedRecords.length);
    if (storedRecords.length > 0) {
        console.log('\n📋 Registered Hashes (for testing):');
        storedRecords.forEach((rec, i) => {
            console.log(`  ${i+1}. ${rec.recordHash} (${capitalizeText(rec.type)})`);
        });
    } else {
        console.log('⚠️  No records registered yet.');
        console.log('📝 Register a record to test verification.');
    }
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n💡 TIP: Open browser DevTools (F12) to see registered hashes');
    console.log('        Copy a hash and paste it in the Verify section');
});

document.getElementById('connectWalletBtn')?.addEventListener('click', async () => {
    await BlockchainService.connectWallet();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('verifyHash') === document.activeElement) {
        verifyRecord();
    }
});

// ========================================
// ANIMATIONS & INTERACTIONS
// ========================================

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInLeft 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, .step-card, .feature-card, .benefit-card, .problem-card').forEach(el => {
    observer.observe(el);
});

// Allow pressing Enter in verify input
document.getElementById('verifyHash')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verifyRecord();
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripples = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripples.style.width = ripples.style.height = size + 'px';
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.classList.add('ripple');
        
        // Optional: add CSS for ripple effect
        // this.appendChild(ripples);
    });
});

console.log('CryptaCore initialized successfully!');
console.log('Sample records loaded:', registeredRecords.length);
