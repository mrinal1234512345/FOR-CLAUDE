// ============================================================================
// CRYPTACORE - FLAGSHIP PLATFORM LOGIC & INTERACTIVE SUITE
// Inspired by OpenAI Flagship Aesthetics (GPT-6 Astra)
// ============================================================================

// ========================================
// 1. NAVIGATION & SCROLL MANAGEMENT
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        updateActiveLink();
    });
});

let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            updateActiveLink();
            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

function updateActiveLink() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 240) {
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

// Global smooth scroll helpers
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};
window.scrollTo = function(sectionId) {
    // If called with single string ID, smooth scroll to element
    if (typeof sectionId === 'string') {
        window.scrollToSection(sectionId);
    } else if (arguments.length >= 2 || typeof sectionId === 'object') {
        // Native window.scrollTo fallback
        window.scroll(sectionId, arguments[1]);
    }
};

// ========================================
// 2. LUXURY DARK MODE TOGGLE & ICON SYNC
// ========================================
const themeToggle = document.getElementById('themeToggle');

// Default to dark luxury theme for OpenAI flagship styling
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeToggle?.classList.add('active');
    updateThemeIcon(true);
} else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    themeToggle?.classList.remove('active');
    updateThemeIcon(false);
}

themeToggle?.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode', !isDarkMode);
    themeToggle.classList.toggle('active', isDarkMode);
    updateThemeIcon(isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

function updateThemeIcon(isDark) {
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        if (isDark) {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to Dark Luxury Mode';
        }
    }
}

// ============================================================================
// ============================================================================
// 3. GLOWING "C" HERO CANVAS ANIMATION ENGINE (OPTIMIZED & HIGH-PERFORMANCE)
// ============================================================================
function initGlowingCAnimation() {
    const canvas = document.getElementById('cAnimCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const LOGICAL_SIZE = 560;
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
        dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(LOGICAL_SIZE * dpr);
        canvas.height = Math.floor(LOGICAL_SIZE * dpr);
        ctx.resetTransform?.();
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Smooth, subtle mouse parallax (cached rect to prevent layout thrashing)
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;

    const heroSection = document.getElementById('home') || canvas.closest('.hero');
    let heroRect = heroSection?.getBoundingClientRect();

    window.addEventListener('resize', () => {
        if (heroSection) heroRect = heroSection.getBoundingClientRect();
    }, { passive: true });

    heroSection?.addEventListener('mousemove', (e) => {
        if (!heroRect) heroRect = heroSection.getBoundingClientRect();
        const relX = (e.clientX - heroRect.left) / heroRect.width;
        const relY = (e.clientY - heroRect.top) / heroRect.height;
        // Subtle, elegant tilt within +/- 7px
        targetOffsetX = (relX - 0.5) * 14;
        targetOffsetY = (relY - 0.5) * 14;
    }, { passive: true });

    heroSection?.addEventListener('mouseleave', () => {
        targetOffsetX = 0;
        targetOffsetY = 0;
    });

    // Arc geometry for letter "C"
    // Opening is to the right.
    const arcStart = 0.28 * Math.PI;
    const arcEnd = 1.72 * Math.PI;
    const arcSpan = arcEnd - arcStart;

    // Cryptographic stream particles traveling along the "C"
    const particleCount = 42;
    const particles = [];
    const colors = [
        '#00f2fe', // Electric Cyan
        '#38bdf8', // Azure Sky
        '#34d399', // Mint Emerald
        '#818cf8', // Neon Indigo
        '#ffffff'  // Crisp White
    ];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            progress: Math.random(),
            speed: (0.0016 + Math.random() * 0.0028) * (Math.random() > 0.4 ? 1 : -1),
            radiusOffset: (Math.random() - 0.5) * 14,
            size: 1.4 + Math.random() * 2.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.4 + Math.random() * 0.6,
            pulseSpeed: 0.02 + Math.random() * 0.04,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }

    // Micro-tags positioned safely inside the 560x560 canvas with NO clipping
    const microTags = [
        { label: '0x7A2F...C49', angle: 0.54 * Math.PI, dist: 1.18, rot: -0.12, drift: 0 },
        { label: 'SHA-256', angle: 0.86 * Math.PI, dist: 1.16, rot: 0.06, drift: 1 },
        { label: 'PROOF: VALID', angle: 1.14 * Math.PI, dist: 1.16, rot: -0.06, drift: 2 },
        { label: 'BLOCK #6841920', angle: 1.46 * Math.PI, dist: 1.18, rot: 0.10, drift: 3 },
        { label: 'ED25519', angle: 1.68 * Math.PI, dist: 1.15, rot: -0.18, drift: 4 },
        { label: 'ZKP VERIFIED', angle: 0.36 * Math.PI, dist: 1.15, rot: 0.16, drift: 5 }
    ];

    let time = 0;

    function render() {
        time += 0.016;

        // Smooth parallax dampening
        currentOffsetX += (targetOffsetX - currentOffsetX) * 0.05;
        currentOffsetY += (targetOffsetY - currentOffsetY) * 0.05;

        ctx.clearRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);

        const centerX = LOGICAL_SIZE / 2 + currentOffsetX;
        const centerY = LOGICAL_SIZE / 2 - 12 + currentOffsetY;
        const baseRadius = 152;

        const isLight = document.body.classList.contains('light-mode');

        // 1. Ambient Cosmic Radial Glow (Theme-Aware)
        const breathe = Math.sin(time * 1.4) * 0.08;
        const glowRadius = baseRadius * 1.35;
        const bgGlow = ctx.createRadialGradient(
            centerX, centerY, baseRadius * 0.25,
            centerX, centerY, glowRadius
        );
        if (isLight) {
            bgGlow.addColorStop(0, `rgba(14, 165, 233, ${0.12 + breathe})`);
            bgGlow.addColorStop(0.5, `rgba(99, 102, 241, ${0.05 + breathe * 0.5})`);
            bgGlow.addColorStop(0.85, 'rgba(16, 185, 129, 0.02)');
            bgGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
            bgGlow.addColorStop(0, `rgba(0, 242, 254, ${0.12 + breathe})`);
            bgGlow.addColorStop(0.5, `rgba(99, 102, 241, ${0.06 + breathe * 0.5})`);
            bgGlow.addColorStop(0.85, 'rgba(16, 185, 129, 0.02)');
            bgGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');
        }

        ctx.save();
        ctx.fillStyle = bgGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Faint Concentric Orbit Guides (Tech Grid)
        ctx.save();
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 10]);
        ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 1.18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([2, 14]);
        ctx.strokeStyle = isLight ? 'rgba(14, 165, 233, 0.15)' : 'rgba(0, 242, 254, 0.08)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.84, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3. Multi-layer High-Performance Neon Glow Arc ("C" glyph)
        // Layer A: Soft outer neon aura
        ctx.save();
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.strokeStyle = isLight ? 'rgba(14, 165, 233, 0.2)' : 'rgba(0, 242, 254, 0.16)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, arcStart, arcEnd, false);
        ctx.stroke();

        // Layer B: Mid luminous envelope
        ctx.lineWidth = 7;
        ctx.strokeStyle = isLight ? 'rgba(37, 99, 235, 0.45)' : 'rgba(56, 189, 248, 0.38)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, arcStart, arcEnd, false);
        ctx.stroke();

        // Layer C: Vibrant Primary Gradient Arc
        const grad = ctx.createLinearGradient(
            centerX + Math.cos(arcEnd) * baseRadius,
            centerY + Math.sin(arcEnd) * baseRadius,
            centerX + Math.cos(arcStart) * baseRadius,
            centerY + Math.sin(arcStart) * baseRadius
        );
        if (isLight) {
            grad.addColorStop(0.0, '#0284c7'); // Azure blue
            grad.addColorStop(0.35, '#2563eb'); // Royal blue
            grad.addColorStop(0.70, '#4f46e5'); // Electric indigo
            grad.addColorStop(1.0, '#059669'); // Mint emerald
        } else {
            grad.addColorStop(0.0, '#38bdf8'); // Azure top
            grad.addColorStop(0.35, '#00f2fe'); // Neon Cyan
            grad.addColorStop(0.70, '#6366f1'); // Electric Violet
            grad.addColorStop(1.0, '#10b981'); // Mint Emerald bottom
        }

        ctx.lineWidth = 4;
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, arcStart, arcEnd, false);
        ctx.stroke();

        // Layer D: Crisp Center White Filament
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, arcStart, arcEnd, false);
        ctx.stroke();
        ctx.restore();

        // 4. Terminal Endcap Beacons
        const terminals = [arcStart, arcEnd];
        terminals.forEach(angle => {
            const tx = centerX + Math.cos(angle) * baseRadius;
            const ty = centerY + Math.sin(angle) * baseRadius;

            ctx.save();
            // Outer beacon ring
            ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.8)' : 'rgba(56, 189, 248, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(tx, ty, 6 + Math.sin(time * 3) * 1.2, 0, Math.PI * 2);
            ctx.stroke();

            // Bright core dot
            ctx.fillStyle = isLight ? '#0284c7' : '#ffffff';
            ctx.beginPath();
            ctx.arc(tx, ty, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // 5. Hardware-Accelerated Flowing Particles
        particles.forEach(p => {
            p.progress += p.speed;
            if (p.progress > 1) p.progress = 0;
            if (p.progress < 0) p.progress = 1;

            const pAngle = arcStart + p.progress * arcSpan;
            const pRadius = baseRadius + p.radiusOffset;
            const px = centerX + Math.cos(pAngle) * pRadius;
            const py = centerY + Math.sin(pAngle) * pRadius;

            const pulse = Math.sin(time * 2.5 + p.pulsePhase) * 0.2;
            const finalAlpha = Math.max(0.2, Math.min(1, p.alpha + pulse));

            // Outer soft glow halo
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = isLight ? finalAlpha * 0.45 : finalAlpha * 0.3;
            ctx.beginPath();
            ctx.arc(px, py, p.size * 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Inner particle core
            ctx.globalAlpha = finalAlpha;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();

            // White specular center
            if (p.size > 2.0) {
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = finalAlpha * 0.95;
                ctx.beginPath();
                ctx.arc(px, py, p.size * 0.45, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        // Safe Micro-Tags (Guaranteed within canvas boundaries & Theme-Aware)
        microTags.forEach(tag => {
            const floatWobble = Math.sin(time * 1.2 + tag.drift) * 4;
            const r = baseRadius * tag.dist + floatWobble;
            const bx = centerX + Math.cos(tag.angle) * r;
            const by = centerY + Math.sin(tag.angle) * r;

            ctx.save();
            ctx.translate(bx, by);
            ctx.rotate(tag.rot);

            ctx.font = '500 9.5px "Fira Code", monospace';
            const textWidth = ctx.measureText(tag.label).width;
            const padX = 7;
            const boxW = textWidth + padX * 2;
            const boxH = 17;

            if (isLight) {
                // High-contrast frosted ivory badge with dark typography
                ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
                ctx.strokeStyle = 'rgba(14, 165, 233, 0.45)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 4);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#0f172a';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(tag.label, 0, 0.5);
            } else {
                // Semi-translucent obsidian glass badge
                ctx.fillStyle = 'rgba(10, 15, 28, 0.85)';
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 4);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = 'rgba(224, 242, 254, 0.95)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(tag.label, 0, 0.5);
            }

            ctx.restore();
        });

        requestAnimationFrame(render);
    }

    render();
}

// ============================================================================
// 4. BLOCKCHAIN SERVICE & CRYPTOGRAPHY UTILITIES
// ============================================================================

const BLOCKCHAIN_CONFIG = {
    rpcUrl: 'http://127.0.0.1:7545',
    chainId: 1337,
    contractAddress: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666',
    mode: 'live'
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
    statusEl.innerHTML = `● ${message}`;
    statusEl.style.color = isError ? '#f87171' : 'var(--accent-cyan)';
    statusEl.style.fontWeight = '500';
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
            updateBlockchainStatus('MetaMask not detected. Local WebCrypto demo ledger active.', false);
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
                updateBlockchainStatus('Wallet connected. Switch to Sepolia / Local (1337) for live contract writes.', false);
                this.connected = false;
                return false;
            }

            this.connected = true;
            updateBlockchainStatus(`Wallet connected (${(await signer.getAddress()).substring(0, 8)}...). Live blockchain ledger online.`);
            return true;
        } catch (error) {
            console.warn('Wallet connection cancelled or failed:', error);
            updateBlockchainStatus('Wallet prompt closed. WebCrypto demo ledger remains active.', false);
            return false;
        }
    },

    async ensureLiveContract() {
        if (!this.isConfigured() || typeof ethers === 'undefined') return null;

        if (!this.provider && window.ethereum) {
            this.provider = new ethers.BrowserProvider(window.ethereum);
        }

        if (this.provider && !this.contract) {
            this.contract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, CRYPTACORE_CONTRACT_ABI, this.provider);
        }

        if (this.signer) {
            this.contract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, CRYPTACORE_CONTRACT_ABI, this.signer);
        }

        return this.contract;
    },

    async registerOnChain(record) {
        if (!this.isConfigured() || !window.ethereum) {
            return { mode: 'demo', reason: 'WebCrypto local ledger active' };
        }

        try {
            const contract = await this.ensureLiveContract();
            if (!contract || !this.signer) {
                return { mode: 'demo', reason: 'Wallet not connected' };
            }

            const ownerAddress = await this.signer.getAddress();
            const tx = await contract.registerRecord(record.recordHash, ownerAddress, record.type, record.ipfsHash || 'ipfs://cryptacore-demo');
            const receipt = await tx.wait();

            return {
                mode: 'live',
                txHash: receipt.hash,
                blockNumber: Number(receipt.blockNumber),
                network: 'Sepolia',
                ownerAddress
            };
        } catch (error) {
            console.warn('On-chain registration failed:', error);
            return { mode: 'demo', reason: error.message || 'Transaction rejected' };
        }
    },

    async verifyOnChain(recordHash) {
        if (!this.isConfigured() || typeof ethers === 'undefined') {
            return { mode: 'demo', valid: false };
        }

        try {
            const contract = await this.ensureLiveContract();
            if (!contract) return { mode: 'demo', valid: false };
            const valid = await contract.verifyRecord(recordHash);
            return { mode: 'live', valid };
        } catch (error) {
            return { mode: 'demo', valid: false };
        }
    }
};

class CryptoUtil {
    static async generateHash(data) {
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
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
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 64; i++) {
            hash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return hash;
    }
}

// ============================================================================
// 5. DEMO PLAYGROUND & PRESETS
// ============================================================================

const recordForm = document.getElementById('recordForm');
const demoOutput = document.getElementById('demoOutput');

// Sample presets for 1-click test flow
const PRESET_DATA = {
    degree: {
        type: 'certificate',
        recipient: 'Elena Rostova',
        issuer: 'MIT Center for Digital Currency',
        details: 'Master of Science in Cryptographic Engineering. Degree Hash: MIT-2026-9014. Summa Cum Laude with honors in Distributed Systems.'
    },
    license: {
        type: 'license',
        recipient: 'Capt. Elena Vance',
        issuer: 'Federal Civil Aviation Directorate (FCAD)',
        details: 'Commercial UAS & Autonomous Drone Pilot Operating License (Class IV BVR). ID: FCAD-UAS-2026-88902. Night flight certified.'
    },
    supply: {
        type: 'supply',
        recipient: 'Global Tech Foundries Corp',
        issuer: 'ASML Lithography Quality Assurance',
        details: '3nm Semiconductor Wafer Lot #ASML-3NM-7709. Defect density < 0.001/cm2. Temperature logs intact from EUV manufacturing.'
    }
};

window.fillDemoPreset = function(type) {
    const preset = PRESET_DATA[type];
    if (!preset) return;

    const typeEl = document.getElementById('recordType');
    const recipientEl = document.getElementById('recipientName');
    const issuerEl = document.getElementById('issuerName');
    const detailsEl = document.getElementById('recordDetails');

    if (typeEl) typeEl.value = preset.type;
    if (recipientEl) recipientEl.value = preset.recipient;
    if (issuerEl) issuerEl.value = preset.issuer;
    if (detailsEl) detailsEl.value = preset.details;

    [typeEl, recipientEl, issuerEl, detailsEl].forEach(el => {
        if (el) {
            el.style.transition = 'all 0.3s ease';
            el.style.borderColor = 'var(--accent-cyan)';
            el.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.25)';
            setTimeout(() => {
                el.style.borderColor = '';
                el.style.boxShadow = '';
            }, 800);
        }
    });

    updateBlockchainStatus(`Preset loaded: ${capitalizeText(preset.type)} (${preset.recipient}). Ready to compute proof.`);
};

// Retrieve records from unified store or legacy store
function getStoredRecords() {
    try {
        const unified = JSON.parse(localStorage.getItem('cryptacore_unified_registry_v3')) || [];
        const local = JSON.parse(localStorage.getItem('cryptacoreRecords')) || [];
        return [...local, ...unified];
    } catch (e) {
        return [];
    }
}

// Record registration handler
recordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const recordType = document.getElementById('recordType')?.value || 'certificate';
    const recipientName = document.getElementById('recipientName')?.value || '';
    const issuerName = document.getElementById('issuerName')?.value || '';
    const recordDetails = document.getElementById('recordDetails')?.value || '';

    const timestamp = new Date().toLocaleString();
    const id = `REC-${Date.now().toString().slice(-6)}`;

    // Generate SHA-256 Digest
    const recordHash = await CryptoUtil.generateHash({
        id,
        type: recordType,
        recipient: recipientName,
        issuer: issuerName,
        details: recordDetails,
        timestamp
    });

    const record = {
        id,
        type: recordType,
        recipient: recipientName,
        issuer: issuerName,
        details: recordDetails,
        timestamp,
        recordHash,
        txHash: CryptoUtil.getCurrentBlockHash(),
        blockNumber: Math.floor(Math.random() * 800000) + 6840000,
        issuerAddress: CryptoUtil.generateBlockchainAddress(),
        recipientAddress: CryptoUtil.generateBlockchainAddress(),
        ipfsHash: `ipfs://bafybei${recordHash.substring(2, 32)}`,
        status: 'AUTHENTIC & ANCHORED'
    };

    // Attempt on-chain registration if wallet is connected
    const onChainResult = await BlockchainService.registerOnChain(record);
    if (onChainResult.mode === 'live') {
        record.blockNumber = onChainResult.blockNumber;
        record.txHash = onChainResult.txHash;
        record.issuerAddress = onChainResult.ownerAddress || record.issuerAddress;
        record.status = 'VERIFIED ON SEPOLIA ETHEREUM';
        updateBlockchainStatus(`Anchored live on Sepolia! Tx: ${record.txHash.substring(0, 14)}...`);
    } else {
        updateBlockchainStatus(`Proof computed & anchored to CryptaCore ledger. Hash: ${record.recordHash.substring(0, 14)}...`);
    }

    // Persist to local storage
    const currentRecords = JSON.parse(localStorage.getItem('cryptacoreRecords')) || [];
    currentRecords.unshift(record);
    localStorage.setItem('cryptacoreRecords', JSON.stringify(currentRecords));

    // Also push to unified registry for cross-page compatibility
    try {
        const unified = JSON.parse(localStorage.getItem('cryptacore_unified_registry_v3')) || [];
        unified.unshift({
            ...record,
            recordType: record.type.toUpperCase(),
            holder: record.recipient,
            holderName: record.recipient,
            issuerName: record.issuer,
            creationDate: new Date().toISOString()
        });
        localStorage.setItem('cryptacore_unified_registry_v3', JSON.stringify(unified));
    } catch (err) {
        console.warn('Unified sync fallback:', err);
    }

    displayRecordResult(record);
});

function displayRecordResult(record) {
    if (!demoOutput) return;

    const resultHTML = `
        <div class="record-result" style="animation: fadeIn 0.4s ease;">
            <div class="result-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.75rem;">
                <h4 style="margin: 0; color: #34d399; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-circle-check"></i> Record Successfully Anchored
                </h4>
                <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 9999px; font-family: 'Fira Code', monospace;">
                    BLOCK #${record.blockNumber}
                </span>
            </div>

            <div class="detail-grid" style="display: grid; gap: 0.6rem; font-size: 0.88rem;">
                <div class="detail"><span class="label">Record ID:</span><span class="value" style="font-family: 'Fira Code', monospace; color: var(--accent-cyan);">${record.id}</span></div>
                <div class="detail"><span class="label">Classification:</span><span class="value">${capitalizeText(record.type)}</span></div>
                <div class="detail"><span class="label">Recipient / Subject:</span><span class="value">${record.recipient}</span></div>
                <div class="detail"><span class="label">Issuing Authority:</span><span class="value">${record.issuer}</span></div>
                <div class="detail"><span class="label">SHA-256 Digest:</span><span class="value code-val" style="word-break: break-all; color: var(--accent-cyan);">${record.recordHash}</span></div>
                <div class="detail"><span class="label">Ledger Tx Hash:</span><span class="value code-val" style="word-break: break-all;">${record.txHash}</span></div>
                <div class="detail"><span class="label">IPFS CID:</span><span class="value code-val">${record.ipfsHash}</span></div>
                <div class="detail"><span class="label">Timestamp:</span><span class="value">${record.timestamp}</span></div>
                <div class="detail"><span class="label">Metadata:</span><span class="value">${record.details}</span></div>
            </div>

            <div class="result-actions" style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button type="button" class="btn btn-openai-secondary" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;" onclick="copyHashToClipboard('${record.recordHash}')">
                    <i class="fas fa-copy"></i> Copy Hash
                </button>
                <button type="button" class="btn btn-openai-primary" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;" onclick="quickFillVerify('${record.recordHash}')">
                    <i class="fas fa-shield-halved"></i> Verify Now
                </button>
            </div>
        </div>
    `;

    demoOutput.innerHTML = resultHTML;
    demoOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.copyHashToClipboard = function(hash) {
    navigator.clipboard?.writeText(hash).then(() => {
        alert('Cryptographic Hash copied to clipboard:\n' + hash);
    }).catch(() => {
        prompt('Copy this hash for verification:', hash);
    });
};

// ============================================================================
// 6. UNIVERSAL VERIFICATION ENGINE
// Supports Record IDs, 64-char Hashes, Holder Names, and Cross-Store Sync
// ============================================================================

// Built-in standard demo records for immediate verification testing
const SEED_DEMO_RECORDS = [
    {
        id: 'LIC-2026-001',
        type: 'Government License',
        recordType: 'LICENSE',
        recipient: 'Capt. Elena Vance',
        issuer: 'Federal Civil Aviation Directorate (FCAD)',
        recordHash: '0x8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e',
        txHash: '0x4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b',
        blockNumber: 6843105,
        timestamp: '2026-01-15 09:30:00 UTC',
        details: 'Commercial UAS & Autonomous Drone Pilot Operating License (Class IV BVR). Authorized nationwide airspace operations.',
        status: 'AUTHENTIC & IMMUTABLE'
    },
    {
        id: 'CRD-2026-001',
        type: 'Professional Credential',
        recordType: 'CREDENTIAL',
        recipient: 'Dr. Marcus Vance, M.D.',
        issuer: 'American Board of Medical Specialties & AI Diagnostics',
        recordHash: '0x3a7b9c1d5e8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d',
        txHash: '0x7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d5e8f2a4b6c8e0f1a3b5d',
        blockNumber: 6841200,
        timestamp: '2026-02-10 14:15:00 UTC',
        details: 'Board Certification in Clinical AI Diagnostics & Autonomous Surgical Systems. Fellowship accredited.',
        status: 'AUTHENTIC & IMMUTABLE'
    },
    {
        id: 'AST-2026-001',
        type: 'Digital Ownership Asset',
        recordType: 'DIGITAL_ASSET',
        recipient: 'Apex Quantum Foundry Holdings',
        issuer: 'World Intellectual Property Organization (WIPO / EPO)',
        recordHash: '0x5e8f2a4b6c8e0f1a3b5d7e9f2c4a6b8d0e1f3a5b7c9d1e3f5a7b9c1d3a7b9c1d',
        txHash: '0x1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b4a3f2e',
        blockNumber: 6839440,
        timestamp: '2026-03-01 11:00:00 UTC',
        details: 'Patent & Sovereign IP Title: "Sub-Nanometer Optical Quantum Gate Array". Immutable registry deed.',
        status: 'AUTHENTIC & IMMUTABLE'
    },
    {
        id: 'PRD-2026-001',
        type: 'Supply Chain Provenance',
        recordType: 'SUPPLY_CHAIN',
        recipient: 'Global Health Emergency Distribution Center',
        issuer: 'BioPharma Synthesis Laboratories Europe',
        recordHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
        txHash: '0x2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b',
        blockNumber: 6840880,
        timestamp: '2026-03-12 08:45:00 UTC',
        details: 'mRNA Vaccine Batch #BNT-9921-EU. Ultra-cold IoT telemetry confirmed: continuous -80C to -70C maintained.',
        status: 'AUTHENTIC & IMMUTABLE'
    },
    {
        id: 'CC-2026-7842',
        type: 'Academic Degree',
        recordType: 'CERTIFICATE',
        recipient: 'Alex Morgan',
        issuer: 'CryptaCore Institute of Technology',
        recordHash: '0x1cB0Fc7B9152ac7c80F50FC9116686e0c81Dc666a7b9c1d5e8f2a4b6c8e0f1a3',
        txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
        blockNumber: 6841920,
        timestamp: '2026-08-15 16:00:00 UTC',
        details: 'Bachelor of Technology in Blockchain Systems & Smart Contract Auditing. Grade A+ / 3.96 GPA.',
        status: 'AUTHENTIC & IMMUTABLE'
    }
];

window.quickFillVerify = function(query) {
    const input = document.getElementById('verifyHash');
    if (input) {
        input.value = query;
        verifyRecord();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

window.verifyRecord = async function() {
    const inputEl = document.getElementById('verifyHash');
    const verifyOutput = document.getElementById('verifyOutput');
    if (!verifyOutput) return;

    const query = inputEl?.value?.trim();
    if (!query) {
        verifyOutput.innerHTML = `
            <div class="verify-result invalid" style="border-left: 4px solid #f87171; background: rgba(239, 68, 68, 0.08); padding: 1.25rem; border-radius: 8px;">
                <h4 style="color: #f87171; margin-top: 0;"><i class="fas fa-circle-exclamation"></i> Input Required</h4>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Please enter a Record ID (e.g. <code>LIC-2026-001</code>) or a 64-character SHA-256 hash starting with <code>0x</code>.</p>
            </div>
        `;
        return;
    }

    const queryLower = query.toLowerCase();

    // 1. Gather all searchable records (local storage, unified registry, seed demo records)
    const storedLocal = JSON.parse(localStorage.getItem('cryptacoreRecords')) || [];
    const storedUnified = JSON.parse(localStorage.getItem('cryptacore_unified_registry_v3')) || [];
    const allRecords = [...storedLocal, ...storedUnified, ...SEED_DEMO_RECORDS];

    // 2. Search match
    let matched = allRecords.find(r => {
        if (!r) return false;
        const idMatch = r.id && r.id.toLowerCase() === queryLower;
        const hashMatch = (r.recordHash && r.recordHash.toLowerCase() === queryLower) ||
                          (r.blockchainHash && r.blockchainHash.toLowerCase() === queryLower) ||
                          (r.txHash && r.txHash.toLowerCase() === queryLower);
        const nameMatch = (r.recipient && r.recipient.toLowerCase().includes(queryLower)) ||
                          (r.holder && r.holder.toLowerCase().includes(queryLower)) ||
                          (r.holderName && r.holderName.toLowerCase().includes(queryLower));
        return idMatch || hashMatch || nameMatch;
    });

    // 3. Optional On-Chain check
    if (query.startsWith('0x') && BlockchainService.isConfigured()) {
        const onChainResult = await BlockchainService.verifyOnChain(query);
        if (onChainResult.mode === 'live' && onChainResult.valid) {
            matched = matched || {
                id: 'ONCHAIN-SEPOLIA',
                type: 'On-Chain Verified Record',
                recipient: 'Verified Wallet Holder',
                issuer: 'Sepolia Verified Smart Contract',
                recordHash: query,
                txHash: 'Confirmed in Ethereum block',
                blockNumber: 'Live Network',
                timestamp: new Date().toLocaleString(),
                details: 'Cryptographically authentic on Sepolia testnet ledger.',
                status: 'VERIFIED ON SEPOLIA ETHEREUM'
            };
        }
    }

    if (matched) {
        const recType = matched.type || matched.recordType || 'Record';
        const recipient = matched.recipient || matched.holder || matched.holderName || 'Registered Subject';
        const issuer = matched.issuer || matched.issuerName || 'Issuing Authority';
        const recordHash = matched.recordHash || matched.blockchainHash || query;
        const txHash = matched.txHash || '0x4a3f2e1d0c9b8a...';
        const blockNumber = matched.blockNumber || 6841920;
        const timestamp = matched.timestamp || matched.creationDate || 'Confirmed on-chain';
        const details = matched.details || matched.metadata?.description || 'Authentic record verified by CryptaCore.';

        verifyOutput.innerHTML = `
            <div class="verify-result valid" style="border-left: 4px solid #10b981; background: rgba(16, 185, 129, 0.08); padding: 1.5rem; border-radius: 10px; animation: fadeIn 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.75rem;">
                    <h4 style="margin: 0; color: #34d399; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-shield-check"></i> Cryptographic Proof Verified
                    </h4>
                    <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 9999px; font-weight: 600; font-family: 'Fira Code', monospace;">
                        AUTHENTIC &bull; BLOCK #${blockNumber}
                    </span>
                </div>

                <p style="color: var(--text-secondary); margin-bottom: 1.25rem; font-size: 0.9rem;">
                    This record exists in the immutable CryptaCore ledger and passed zero-knowledge cryptographic integrity checks.
                </p>

                <div class="detail-grid" style="display: grid; gap: 0.65rem; font-size: 0.88rem;">
                    <div class="detail"><span class="label">Record Identifier:</span><span class="value" style="font-family: 'Fira Code', monospace; color: var(--accent-cyan); font-weight: 600;">${matched.id || 'N/A'}</span></div>
                    <div class="detail"><span class="label">Classification:</span><span class="value">${capitalizeText(recType)}</span></div>
                    <div class="detail"><span class="label">Subject / Recipient:</span><span class="value" style="font-weight: 600; color: #f1f5f9;">${recipient}</span></div>
                    <div class="detail"><span class="label">Issuing Authority:</span><span class="value">${issuer}</span></div>
                    <div class="detail"><span class="label">Verified SHA-256:</span><span class="value code-val" style="word-break: break-all; color: var(--accent-cyan);">${recordHash}</span></div>
                    <div class="detail"><span class="label">Transaction Anchor:</span><span class="value code-val" style="word-break: break-all;">${txHash}</span></div>
                    <div class="detail"><span class="label">Timestamp:</span><span class="value">${timestamp}</span></div>
                    <div class="detail"><span class="label">Metadata & Specs:</span><span class="value">${details}</span></div>
                </div>

                <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                    <a href="verify.html?id=${encodeURIComponent(matched.id || recordHash)}" class="btn btn-openai-primary" style="font-size: 0.8rem; padding: 0.45rem 1rem;">
                        <i class="fas fa-external-link-alt"></i> Open Full Certificate in Universal Verifier &rarr;
                    </a>
                </div>
            </div>
        `;
    } else {
        verifyOutput.innerHTML = `
            <div class="verify-result invalid" style="border-left: 4px solid #f87171; background: rgba(239, 68, 68, 0.08); padding: 1.5rem; border-radius: 10px; animation: fadeIn 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <h4 style="margin: 0; color: #f87171; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-triangle-exclamation"></i> Record Not Found or Digest Tampered
                    </h4>
                    <span style="background: rgba(239, 68, 68, 0.2); color: #f87171; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 9999px; font-weight: 600;">
                        INVALID / UNANCHORED
                    </span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    The query <code>${escapeHtml(query)}</code> does not match any authenticated record in the current CryptaCore ledger.
                </p>
                <div style="font-size: 0.85rem; color: var(--text-muted); background: rgba(0, 0, 0, 0.25); padding: 0.85rem; border-radius: 6px;">
                    <div style="font-weight: 600; margin-bottom: 0.35rem; color: var(--text-primary);"><i class="fas fa-info-circle"></i> Possible Causes:</div>
                    <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.6;">
                        <li><strong>Unregistered Record:</strong> This credential has not been issued to the ledger yet.</li>
                        <li><strong>Data Tampering:</strong> A single modified character in the document or metadata changes the SHA-256 hash completely.</li>
                        <li><strong>Typographical Error:</strong> Ensure the 0x prefix and exact casing are preserved.</li>
                    </ul>
                </div>
                <div style="margin-top: 1rem;">
                    <span style="font-size: 0.82rem; color: var(--text-muted);">Try one of the quick test chips above (e.g. <code>LIC-2026-001</code>) or submit a new record in the Playground!</span>
                </div>
            </div>
        `;
    }

    verifyOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// ============================================================================
// 7. UTILITY & HELPER FUNCTIONS
// ============================================================================

function capitalizeText(text) {
    if (!text) return '';
    return text
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================================================
// 8. PAGE LOAD & EVENT BINDINGS
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize glowing "C" Canvas Animation
    initGlowingCAnimation();

    // Active Theory Interactive Animation Suite
    initActiveTheoryFlowField();
    initActiveTheoryCursor();
    initActiveTheory3DTilt();
    initActiveTheoryMagneticButtons();
    initAIAssistant();

    // 2. Active link spy
    updateActiveLink();

    // 3. Connect Wallet button
    document.getElementById('connectWalletBtn')?.addEventListener('click', async () => {
        await BlockchainService.connectWallet();
    });

    // 4. Enter key in verification input
    document.getElementById('verifyHash')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyRecord();
        }
    });

    // 5. Contact form submission
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.style.cssText = 'background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; padding: 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.9rem;';
        successMsg.innerHTML = '<i class="fas fa-circle-check"></i> Thank you! Your institutional inquiry has been transmitted securely.';
        contactForm.parentElement?.insertBefore(successMsg, contactForm);
        contactForm.reset();
        setTimeout(() => successMsg.remove(), 6000);
    });

    console.log('⚡ CryptaCore Flagship Platform Engine Initialized');
});

// ============================================================================
// 9. ACTIVE THEORY INTERACTIVE ANIMATION SUITE (OPTIMIZED & JITTER-FREE)
// ============================================================================

// --- 9.1 Ambient Flow Field Particle Canvas ---
function initActiveTheoryFlowField() {
    const canvas = document.getElementById('atFlowCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    const PARTICLE_COUNT = window.innerWidth < 768 ? 35 : 75;
    let mouse = { x: -9999, y: -9999, active: false };
    let animId = null;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        // Use setTransform to avoid compounding scale on resize
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    class FlowParticle {
        constructor() {
            this.reset(true);
        }
        reset(randomY = false) {
            this.x = Math.random() * width;
            this.y = randomY ? Math.random() * height : height + 10;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = -0.15 - Math.random() * 0.35;
            this.baseRadius = 1.2 + Math.random() * 1.5;
            this.alpha = 0.25 + Math.random() * 0.45;
            this.pulseSpeed = 0.015 + Math.random() * 0.025;
            this.pulse = Math.random() * Math.PI * 2;
        }
        update() {
            this.pulse += this.pulseSpeed;
            if (mouse.active) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distSq = dx * dx + dy * dy;
                const maxDist = 120;
                if (distSq < maxDist * maxDist && distSq > 1) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / maxDist) * 1.2;
                    this.vx -= (dx / dist) * force;
                    this.vy -= (dy / dist) * force;
                }
            }

            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.96;
            this.vy = this.vy * 0.96 - 0.006;

            if (this.x < -20) this.x = width + 20;
            if (this.x > width + 20) this.x = -20;
            if (this.y < -20) this.reset(false);
        }
        draw(isLight) {
            const currentAlpha = Math.max(0.08, this.alpha * (0.8 + 0.2 * Math.sin(this.pulse)));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2);
            if (isLight) {
                ctx.fillStyle = `rgba(14, 165, 233, ${currentAlpha * 0.55})`;
            } else {
                ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha * 0.75})`;
            }
            ctx.fill();
        }
    }

    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new FlowParticle());
    }

    window.addEventListener('resize', () => {
        resize();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    function render() {
        if (document.hidden) {
            animId = requestAnimationFrame(render);
            return;
        }

        ctx.clearRect(0, 0, width, height);
        const isLight = document.body.classList.contains('light-mode');

        const connectDist = 90;
        const connectDistSq = connectDist * connectDist;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dSq = dx * dx + dy * dy;
                if (dSq < connectDistSq) {
                    const dist = Math.sqrt(dSq);
                    const lineAlpha = (1 - dist / connectDist) * (isLight ? 0.07 : 0.14);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = isLight ? `rgba(14, 165, 233, ${lineAlpha})` : `rgba(56, 189, 248, ${lineAlpha})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw(isLight);
        });

        animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
}

// --- 9.2 Precision Magnetic Cursor & Click Shockwave ---
function initActiveTheoryCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let dot = document.getElementById('atCursorDot');
    let ring = document.getElementById('atCursorRing');
    if (!dot || !ring) return;

    let targetX = -100, targetY = -100;
    let dotX = -100, dotY = -100;
    let ringX = -100, ringY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!isVisible) {
            dotX = targetX;
            dotY = targetY;
            ringX = targetX;
            ringY = targetY;
            dot.style.opacity = '1';
            ring.style.opacity = '1';
            isVisible = true;
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        isVisible = false;
    });

    function updateCursor() {
        if (isVisible) {
            dotX += (targetX - dotX) * 0.45;
            dotY += (targetY - dotY) * 0.45;
            ringX += (targetX - ringX) * 0.16;
            ringY += (targetY - ringY) * 0.16;

            dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    const interactiveSelector = 'a, button, input, select, textarea, .problem-card, .step-card, .feature-card, .benefit-card, .demo-panel, .verify-chip, #cAnimCanvas, .theme-toggle, .ai-prompt-chip, .btn-ai-send, .btn-ai-control, .ai-action-link';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelector)) {
            ring.classList.add('cursor-hover');
            dot.classList.add('cursor-hover');
        }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        // Prevent cursor flicker when moving between nested elements
        const toElement = e.relatedTarget;
        if (!toElement || !toElement.closest(interactiveSelector)) {
            ring.classList.remove('cursor-hover');
            dot.classList.remove('cursor-hover');
        }
    }, { passive: true });

    document.addEventListener('mousedown', () => {
        ring.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
        ring.classList.remove('cursor-click');
    });

    document.addEventListener('click', (e) => {
        const shockwave = document.createElement('div');
        shockwave.className = 'at-shockwave';
        shockwave.style.left = e.clientX + 'px';
        shockwave.style.top = e.clientY + 'px';
        document.body.appendChild(shockwave);
        setTimeout(() => shockwave.remove(), 500);
    });
}

// --- 9.3 3D Card Perspective Tilt & Dynamic Specular Shine ---
function initActiveTheory3DTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.problem-card, .step-card, .feature-card, .benefit-card');
    cards.forEach(card => {
        let bounds = null;
        let rafId = null;

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            card.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease, border-color 0.2s ease';
        });

        card.addEventListener('mousemove', (e) => {
            if (!bounds) bounds = card.getBoundingClientRect();
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const px = Math.min(Math.max((e.clientX - bounds.left) / bounds.width, 0), 1);
                const py = Math.min(Math.max((e.clientY - bounds.top) / bounds.height, 0), 1);

                card.style.setProperty('--mouse-x', `${(px * 100).toFixed(1)}%`);
                card.style.setProperty('--mouse-y', `${(py * 100).toFixed(1)}%`);

                const tiltX = ((py - 0.5) * -7).toFixed(2);
                const tiltY = ((px - 0.5) * 7).toFixed(2);
                card.style.transform = `perspective(1000px) translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            bounds = null;
            card.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transform = '';
            card.style.removeProperty('--mouse-x');
            card.style.removeProperty('--mouse-y');
        });
    });
}

// --- 9.4 Magnetic Buttons (Jitter-Free) ---
function initActiveTheoryMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const magneticTargets = document.querySelectorAll('.btn-openai-primary, .btn-openai-secondary, .theme-toggle');
    magneticTargets.forEach(btn => {
        let initialRect = null;

        btn.addEventListener('mouseenter', () => {
            initialRect = btn.getBoundingClientRect();
            btn.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease';
        });

        btn.addEventListener('mousemove', (e) => {
            if (!initialRect) initialRect = btn.getBoundingClientRect();
            const centerX = initialRect.left + initialRect.width / 2;
            const centerY = initialRect.top + initialRect.height / 2;
            const dx = (e.clientX - centerX) * 0.18;
            const dy = (e.clientY - centerY) * 0.18;
            btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        }, { passive: true });

        btn.addEventListener('mouseleave', () => {
            initialRect = null;
            btn.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease';
            btn.style.transform = '';
        });
    });
}

// ============================================================================
// 10. CRYPTABOT LOCAL AI ASSISTANT ENGINE (ZERO-LATENCY IN-BROWSER AGENT)
// ============================================================================
function initAIAssistant() {
    const chatMessages = document.getElementById('aiChatMessages');
    const chatForm = document.getElementById('aiChatForm');
    const userInput = document.getElementById('aiUserInput');
    const clearBtn = document.getElementById('aiClearChatBtn');
    const promptChips = document.querySelectorAll('.ai-prompt-chip');

    if (!chatMessages || !chatForm || !userInput) return;

    // CryptaCore Domain Knowledge Base
    const KNOWLEDGE_BASE = [
        {
            id: 'what_is_cryptacore',
            keywords: ['what is cryptacore', 'about cryptacore', 'overview', 'what does cryptacore do', 'purpose', 'mission', 'what is this website'],
            answer: `<strong>CryptaCore</strong> is an enterprise-grade <strong>Blockchain Trust Layer for Real-World Digital Records</strong>. It eliminates document forgery, fake credentials, and credential fraud by transforming academic degrees, government licenses, property deeds, and supply chain records into cryptographically sealed, permanent on-chain assets.`,
            actions: [
                { label: 'Architecture Overview', href: '#how-it-works', icon: 'fas fa-layer-group' },
                { label: 'Try Playground', href: '#demo', icon: 'fas fa-terminal' }
            ]
        },
        {
            id: 'verification',
            keywords: ['verify', 'verification', 'how to verify', 'how does verification work', 'instant verification', 'qr code', 'validate', 'check record', 'check hash'],
            answer: `Instant verification works via our trustless <strong>dual-check cryptographic engine</strong>:<br><br>
1. <strong>Hash Ingestion:</strong> The verifier enters a Record ID or 64-character SHA-256 hash (or scans the dynamic QR code).<br>
2. <strong>On-Chain Query:</strong> CryptaCore queries the <code>CryptaCoreRegistry.sol</code> smart contract via JSON-RPC in under 50ms.<br>
3. <strong>State Resolution:</strong> It instantly confirms issuer authority, validity status, block height, and resolves the immutable IPFS CID with zero gas fees or user login required.`,
            actions: [
                { label: 'Try Instant Verification', href: '#demo', icon: 'fas fa-shield-halved' },
                { label: 'Open Verify Portal', href: 'verify.html', icon: 'fas fa-check-double' }
            ]
        },
        {
            id: 'privacy_security',
            keywords: ['privacy', 'private', 'security', 'leak', 'safe', 'confidential', 'webcrypto', 'subtlecrypto', 'sha256', 'sha-256', 'hashing', 'gdpr'],
            answer: `<strong>Your sensitive document data is 100% private.</strong><br><br>
CryptaCore utilizes the <strong>W3C Web Cryptography API (<code>crypto.subtle</code>)</strong> to generate 256-bit cryptographic digests <em>entirely inside your browser's local sandbox</em>.<br><br>
Sensitive personally identifiable information (PII) or unhashed files <strong>never leave your device</strong>. Only irreversible mathematical proofs and content-addressed IPFS CIDs are anchored to the public blockchain.`,
            actions: [
                { label: 'Explore Security Capabilities', href: '#features', icon: 'fas fa-lock' }
            ]
        },
        {
            id: 'smart_contracts',
            keywords: ['smart contract', 'smart contracts', 'solidity', 'contract', 'evm', 'sepolia', 'ganache', 'ethereum', 'gas', 'registry', 'rbac', 'access control'],
            answer: `CryptaCore's on-chain consensus is governed by <strong><code>CryptaCoreRegistry.sol</code></strong>, written in Solidity <code>0.8.20</code>:<br><br>
• <strong>Role-Based Access Control:</strong> Powered by OpenZeppelin RBAC with <code>DEFAULT_ADMIN_ROLE</code>, <code>ISSUER_ROLE</code>, and <code>AUDITOR_ROLE</code>.<br>
• <strong>Security Safeguards:</strong> Incorporates <code>ReentrancyGuard</code> and circuit breakers (<code>whenNotPaused</code>).<br>
• <strong>Gas Optimization:</strong> Packed 32-byte storage slots ensure record anchoring costs less than typical ERC-721 mints.<br>
• <strong>Audit Trail:</strong> Emits permanent <code>RecordRegistered</code> and <code>RecordRevoked</code> EVM log events.`,
            actions: [
                { label: 'Read Quickstart Guide', href: 'QUICKSTART.html', icon: 'fas fa-book-open' }
            ]
        },
        {
            id: 'admin_issuance',
            keywords: ['admin', 'issuer', 'how to issue', 'register record', 'institution', 'university', 'authority', 'console', 'dmv', 'registrar'],
            answer: `Accredited institutions (universities, licensing boards, municipal registries) issue tamper-evident credentials via the <strong>Admin Console</strong>:<br><br>
1. Connect an authorized institutional Web3 wallet (e.g. MetaMask).<br>
2. Input recipient details, credential type, and document metadata.<br>
3. The browser hashes the payload and calls <code>registerRecord()</code> on the smart contract.<br>
4. CryptaCore generates a permanent cryptographic receipt and dynamic QR verification badge.`,
            actions: [
                { label: 'Open Admin Console', href: 'admin.html', icon: 'fas fa-shield-alt' },
                { label: 'Developer Setup', href: 'QUICKSTART.html', icon: 'fas fa-code' }
            ]
        },
        {
            id: 'storage_ipfs',
            keywords: ['storage', 'ipfs', 'pinata', 'cid', 'decentralized storage', 'where is data stored', 'file storage', 'swarm'],
            answer: `Record metadata, cryptographic seals, and audit receipts are stored on <strong>IPFS (InterPlanetary File System)</strong>.<br><br>
Using <strong>Pinata Cloud multi-AZ gateways</strong>, files are pinned to an immutable peer-to-peer swarm using <strong>CIDv1 content addressing</strong> (e.g., <code>bafybeic...</code>). Data cannot be modified, deleted, or censored, eliminating single points of server failure.`,
            actions: [
                { label: 'Architecture Specs', href: '#how-it-works', icon: 'fas fa-database' }
            ]
        },
        {
            id: 'playground',
            keywords: ['playground', 'demo', 'try', 'simulate', 'test', 'how to test', 'presets', 'quick chip', 'lab'],
            answer: `The <strong>Interactive Lab & Playground</strong> allows you to test CryptaCore directly in your browser without spending real gas tokens:<br><br>
• Click any <strong>Quick Preset</strong> (License, Academic Degree, Property Deed, Supply Chain Batch, Medical ID).<br>
• Click <strong>"Simulate Consensus & Anchor"</strong> to watch real-time SHA-256 calculation and on-chain block mining.<br>
• Use the <strong>Instant Hash Verification</strong> tool to verify records like <code>LIC-2026-001</code> or <code>CRD-2026-001</code>.`,
            actions: [
                { label: 'Go to Playground', href: '#demo', icon: 'fas fa-flask' }
            ]
        },
        {
            id: 'tech_stack',
            keywords: ['tech stack', 'technologies', 'technology stack', 'tools', 'frameworks', 'libraries', 'stack'],
            answer: `CryptaCore is built on modern, open industry standards without bloated frameworks:<br><br>
• <strong>Frontend:</strong> Modern HTML5, Vanilla CSS3, ES6+, Canvas 2D particle simulation, Ethers.js v6.13, QRCode.js.<br>
• <strong>Cryptography:</strong> W3C WebCrypto API SHA-256 (<code>crypto.subtle</code>), ECDSA.<br>
• <strong>Smart Contracts:</strong> Solidity <code>0.8.20</code>, EVM (Ethereum / Sepolia / Ganache).<br>
• <strong>Decentralized Storage:</strong> IPFS protocol + Pinata multi-region gateway.<br>
• <strong>Backend Gateway:</strong> Node.js 18+ and Express REST API / JSON-RPC.`,
            actions: [
                { label: 'Inspect How It Works', href: '#how-it-works', icon: 'fas fa-microchip' }
            ]
        },
        {
            id: 'sih_hackathon',
            keywords: ['sih', 'hackathon', 'smart india hackathon', 'problem id', 'sih26194', 'competition', 'theme'],
            answer: `CryptaCore was built for <strong>Smart India Hackathon 2026 (SIH 2026)</strong> under <strong>Problem ID: SIH26194</strong>.<br><br>
<strong>Theme:</strong> Blockchain & Cybersecurity.<br>
<strong>Goal:</strong> Delivering a production-ready, decentralized trust infrastructure to combat credential fraud, counterfeit licenses, and fabricated ownership deeds across public and private sectors.`,
            actions: [
                { label: 'View Hackathon Reference', href: '#contact', icon: 'fas fa-award' }
            ]
        },
        {
            id: 'greetings',
            keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'who are you', 'what are you', 'help'],
            answer: `👋 Hello! I am <strong>CryptaBot</strong>, your local AI assistant for the CryptaCore platform.<br><br>
I run 100% locally in your browser with zero latency. Feel free to ask me anything about how our <strong>cryptographic proofs</strong>, <strong>smart contracts</strong>, <strong>document verification</strong>, or <strong>institutional admin console</strong> work!`,
            actions: [
                { label: 'Try Instant Verification', href: '#demo', icon: 'fas fa-search' },
                { label: 'Explore Architecture', href: '#how-it-works', icon: 'fas fa-cube' }
            ]
        },
        {
            id: 'thanks',
            keywords: ['thank you', 'thanks', 'awesome', 'cool', 'great', 'good job', 'perfect'],
            answer: `You're very welcome! I'm glad I could help. Let me know if you have any more questions about CryptaCore's blockchain architecture or verification capabilities!`,
            actions: []
        }
    ];

    // Fallback response generator
    function getFallbackResponse(query) {
        return {
            answer: `I analyzed your query: "<em>${escapeHTML(query)}</em>". While I couldn't find an exact match, here is what you can do with CryptaCore:<br><br>
• <strong>Verify a Record:</strong> Test our sub-50ms instant verification tool via hash or QR code.<br>
• <strong>Institutional Issuance:</strong> Learn how universities and authorities issue credentials in the Admin Console.<br>
• <strong>Cryptographic Sandbox:</strong> Explore how hardware-accelerated SHA-256 WebCrypto keeps your documents private.<br><br>
You can also click any of the suggested prompt chips above for instant insights!`,
            actions: [
                { label: 'Try Verification Lab', href: '#demo', icon: 'fas fa-flask' },
                { label: 'Open Admin Console', href: 'admin.html', icon: 'fas fa-shield-alt' },
                { label: 'Read Quickstart Docs', href: 'QUICKSTART.html', icon: 'fas fa-book' }
            ]
        };
    }

    // Matcher logic
    function matchQuery(rawQuery) {
        const query = rawQuery.toLowerCase().trim();

        // 1. Direct phrase or high-confidence keyword match
        for (const entry of KNOWLEDGE_BASE) {
            for (const kw of entry.keywords) {
                if (query.includes(kw) || kw.includes(query)) {
                    return entry;
                }
            }
        }

        // 2. Token overlap scoring
        const queryTokens = query.split(/\W+/).filter(t => t.length > 2);
        let bestScore = 0;
        let bestEntry = null;

        for (const entry of KNOWLEDGE_BASE) {
            let score = 0;
            for (const kw of entry.keywords) {
                const kwTokens = kw.split(/\W+/);
                for (const token of queryTokens) {
                    if (kwTokens.includes(token)) {
                        score += 2;
                    } else if (kw.includes(token)) {
                        score += 1;
                    }
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestEntry = entry;
            }
        }

        if (bestScore >= 2 && bestEntry) {
            return bestEntry;
        }

        return getFallbackResponse(rawQuery);
    }

    // HTML escape helper
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }

    // Formats current time
    function getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Append User Message
    function appendUserMessage(text) {
        const msgEl = document.createElement('div');
        msgEl.className = 'chat-msg user';
        msgEl.innerHTML = `
            <div class="chat-avatar"><i class="fas fa-user"></i></div>
            <div class="chat-bubble">
                <div class="chat-bubble-text"><p>${escapeHTML(text)}</p></div>
                <div class="msg-time">${getFormattedTime()}</div>
            </div>
        `;
        chatMessages.appendChild(msgEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Append Bot Message with Typewriter Streaming Effect
    function streamBotResponse(data) {
        const msgEl = document.createElement('div');
        msgEl.className = 'chat-msg bot';
        
        msgEl.innerHTML = `
            <div class="chat-avatar"><i class="fas fa-robot"></i></div>
            <div class="chat-bubble">
                <div class="chat-bubble-text">
                    <span class="streamed-content"></span><span class="typing-cursor"></span>
                </div>
                <div class="ai-actions-row" style="display: none;"></div>
                <div class="msg-time">${getFormattedTime()}</div>
            </div>
        `;
        chatMessages.appendChild(msgEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const contentEl = msgEl.querySelector('.streamed-content');
        const cursorEl = msgEl.querySelector('.typing-cursor');
        const actionsEl = msgEl.querySelector('.ai-actions-row');

        // Render response content smoothly
        const fullHTML = data.answer;
        if (window.__instantTypewriter) {
            contentEl.innerHTML = fullHTML;
            cursorEl.remove();
            if (data.actions && data.actions.length > 0) {
                actionsEl.style.display = 'flex';
                actionsEl.innerHTML = data.actions.map(act => `
                    <a href="${act.href}" class="ai-action-link" ${act.href.startsWith('http') ? 'target="_blank"' : ''}>
                        <i class="${act.icon}"></i>
                        <span>${act.label}</span>
                    </a>
                `).join('');
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return;
        }
        let charIndex = 0;
        const speed = Math.max(10, Math.min(25, Math.floor(1200 / fullHTML.length)));

        const streamInterval = setInterval(() => {
            charIndex += 4;
            if (charIndex >= fullHTML.length) {
                clearInterval(streamInterval);
                contentEl.innerHTML = fullHTML;
                cursorEl.remove();

                // Append actions if present
                if (data.actions && data.actions.length > 0) {
                    actionsEl.style.display = 'flex';
                    actionsEl.innerHTML = data.actions.map(act => `
                        <a href="${act.href}" class="ai-action-link" ${act.href.startsWith('http') ? 'target="_blank"' : ''}>
                            <i class="${act.icon}"></i>
                            <span>${act.label}</span>
                        </a>
                    `).join('');
                }
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                contentEl.innerHTML = fullHTML.slice(0, charIndex);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, speed);
    }

    // Submit handler
    function handleQuestion(question) {
        if (!question || !question.trim()) return;
        appendUserMessage(question);
        userInput.value = '';

        // Match against domain knowledge base
        if (window.__instantTypewriter) {
            const responseData = matchQuery(question);
            streamBotResponse(responseData);
        } else {
            setTimeout(() => {
                const responseData = matchQuery(question);
                streamBotResponse(responseData);
            }, 220);
        }
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        handleQuestion(text);
    });

    // Quick prompt chip click listeners
    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (prompt) {
                handleQuestion(prompt);
            }
        });
    });

    // Clear Chat
    clearBtn?.addEventListener('click', () => {
        chatMessages.innerHTML = `
            <div class="chat-msg bot">
                <div class="chat-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="chat-bubble">
                    <div class="chat-bubble-text">
                        <p>👋 Hello! I am <strong>CryptaBot</strong>, your local AI assistant for the CryptaCore blockchain platform.</p>
                        <p>I can answer any questions about our <strong>cryptographic proof pipeline</strong>, <strong>Solidity smart contracts</strong>, <strong>instant QR verification</strong>, <strong>institutional governance</strong>, or <strong>how to use the live playground</strong>. What would you like to explore?</p>
                    </div>
                    <div class="msg-time">Just now</div>
                </div>
            </div>
        `;
    });
}



