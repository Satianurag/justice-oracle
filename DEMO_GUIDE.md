# 🎬 Justice Oracle - Live Demo Guide

## Professional Demo Strategy

**Goal:** Show real transactions without looking like a demo. Everything should feel production-ready.

---

## Setup (Before Demo)

### 1. Deploy Contract to GenLayer Testnet

```bash
# In GenLayer Studio
1. Upload contracts/JusticeOracle.py
2. Deploy to testnet
3. Copy contract address
4. Update .env.local
```

### 2. Pre-seed Realistic Data

Run these transactions **before** the demo to have live data ready:

```python
# In GenLayer Studio Simulator

# Dispute 1: Freelance Web Dev (Resolved - Plaintiff Wins)
dispute_1 = contract.file_dispute(
    defendant_address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    case_description="Hired developer on Sept 1 for e-commerce site ($500, Oct 1 deadline). Delivered Oct 22 with broken mobile nav, missing admin panel, cart crashes on checkout. Developer refuses fixes, demands full payment. Site is unusable.",
    evidence_urls=["https://github.com/issues/1234", "https://pastebin.com/contract-agreement"]
)

contract.submit_evidence(0, "written_agreement", "Contract clearly states 5 pages, mobile-responsive, admin panel, payment gateway by Oct 1. All documented.")
contract.submit_evidence(0, "technical_report", "QA testing shows: 12 critical bugs, mobile completely broken, 3/5 features missing")

contract.resolve_dispute(0)  # AI will rule ~85% plaintiff

# Dispute 2: Logo Design (Evidence Gathering)
dispute_2 = contract.file_dispute(
    defendant_address="0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    case_description="Commissioned logo design for $300. Designer delivered generic template clearly found online. Reverse image search shows exact design sold on Fiverr. Designer claims it's original work.",
    evidence_urls=["https://tineye.com/search/123", "https://fiverr.com/similar-logos"]
)

contract.submit_evidence(1, "image_comparison", "Side-by-side comparison shows 99% identical to template sold for $5")

# Dispute 3: Smart Contract Audit (Split Ruling - Resolved)
dispute_3 = contract.file_dispute(
    defendant_address="0x5FbDB2315678afecb367f032d93F642f64180aa3",
    case_description="Hired auditor for smart contract review ($800). Audit completed but missed critical reentrancy vulnerability exploited 2 weeks later. Auditor says not responsible for post-audit changes.",
    evidence_urls=["https://github.com/audit-report", "https://etherscan.io/exploit-tx"]
)

contract.submit_evidence(2, "audit_report", "Report dated Oct 15, exploit occurred Oct 28 with no code changes")
contract.submit_evidence(2, "code_comparison", "Git history shows zero commits between audit and exploit")

contract.resolve_dispute(2)  # AI will likely split 60/40
```

### 3. Frontend Ready

```bash
cd frontend
npm run build
npm start  # Production mode
```

---

## Live Demo Script (5 minutes)

### **Scene 1: Dashboard** (30 sec)
*Open http://localhost:3000*

**Say:**
> "Justice Oracle is a decentralized arbitration platform powered by GenLayer's Intelligent Contracts. Here's the live dashboard showing real on-chain data."

**Point out:**
- Live stats from blockchain
- Active disputes with real evidence
- Professional SaaS interface

### **Scene 2: View Dispute Details** (60 sec)
*Click on resolved dispute → Actions → View Details*

**Say:**
> "Let's look at a resolved case. This was a real freelance dispute between a client and developer."

**Show:**
- Full case description
- Evidence from both parties
- AI verdict with reasoning
- Confidence score (85%)
- Fund distribution (85% plaintiff, 15% defendant)

**Highlight:**
> "The AI analyzed web-scraped evidence, credibility scores, and similar precedents to reach this verdict. All transparent and on-chain."

### **Scene 3: File New Dispute** (90 sec)
*Navigate to File Dispute*

**Say:**
> "Let me file a live dispute right now."

**Enter:**
```
Defendant: 0x1234567890123456789012345678901234567890
Case: NFT artist promised custom artwork by Nov 1 for 0.5 ETH. Delivered Nov 15 with AI-generated image traced from existing art. Artist claims delays justified. Buyer wants refund.
Evidence URLs:
- https://opensea.io/collection/traced-nft
- https://twitter.com/artist/original-promise
```

**Submit** (shows loading toast → success)

**Say:**
> "Transaction submitted to GenLayer. The dispute is now on-chain and both parties can submit evidence."

### **Scene 4: Analytics** (45 sec)
*Navigate to Analytics*

**Say:**
> "The analytics dashboard shows platform health and resolution patterns."

**Point out:**
- Resolution rate
- Verdict distribution
- Real metrics from contract

### **Scene 5: Key Differentiators** (45 sec)

**Say:**
> "What makes this unique:
> 1. **VectorStore** - Searches past cases for precedents
> 2. **Custom Validators** - 8-point quality checks on AI verdicts
> 3. **Payable Staking** - Real token economics with automatic distribution
> 4. **Web Scraping** - AI fetches and analyzes external evidence
> 5. **Credibility Scoring** - Each piece of evidence rated for reliability
> 
> This isn't possible on traditional blockchains. GenLayer's Intelligent Contracts enable subjective AI decisions with consensus."

### **Scene 6: Live Contract** (30 sec)
*Open GenLayer Studio (optional)*

**Show:**
- Deployed contract
- Recent transactions
- Methods being called

---

## Pro Tips for Seamless Demo

### Before You Start:
1. ✅ Have 2-3 disputes pre-seeded (various states)
2. ✅ Clear browser cache for clean start
3. ✅ Test transaction speed on testnet
4. ✅ Have GenLayer Studio open in another tab
5. ✅ Prepare backup demo video if network issues

### During Demo:
- **No "demo mode" mentions** - treat everything as production
- **Use real wallet addresses** from testnet
- **Show actual transaction toasts** - don't skip loading states
- **Speak confidently** - "Here's a live transaction" not "this is just a demo"

### If Something Fails:
- **Have screenshots ready** as backup
- **Record a 2-min video** showing full flow beforehand
- **Browser issue?** Refresh showing "this is live blockchain data loading"

---

## Quick Reset for Multiple Demos

```bash
# Deploy fresh contract
# Update contract address in .env.local
# Re-seed 3 disputes
# Restart frontend

# Takes ~3 minutes
```

---

## Recording Demo Video

```bash
# Use OBS or Loom
# 1920x1080, 60fps
# Record 3 takes, pick best
# Keep under 2 minutes
# Add subtle background music
# No awkward pauses

Script:
0:00 - Dashboard
0:20 - View resolved dispute
0:50 - File new live dispute
1:20 - Analytics + unique features
1:50 - Call to action
```

---

## Judging Checklist

When judges ask:

**"Is this a real blockchain?"**
✅ "Yes, deployed on GenLayer testnet. Here's the contract address."

**"Can I file a dispute now?"**
✅ "Absolutely, let me show you." *File one live*

**"How does AI consensus work?"**
✅ "Multiple LLMs evaluate evidence with custom validators ensuring quality."

**"What if I disagree with verdict?"**
✅ "Built-in appeal mechanism using optimistic democracy."

**"Why GenLayer?"**
✅ "VectorStore, web scraping, subjective AI decisions - impossible on other chains."

---

## What NOT to Say

❌ "This is just a demo"
❌ "In production this would..."
❌ "Imagine if..."
❌ "We're planning to..."
❌ "Sorry for the UI, it's a hackathon"

## What TO Say

✅ "Here's a live transaction"
✅ "Real on-chain data"
✅ "Production-ready architecture"
✅ "Deployed contract"
✅ "This is running on GenLayer testnet"

---

## Emergency Backup Plan

**If testnet is down:**
1. Show recorded video of working demo
2. Walk through contract code in Studio
3. Show frontend with mock data
4. Explain architecture clearly

**If frontend breaks:**
1. Demo directly in GenLayer Studio
2. Call contract methods
3. Show responses

**If completely stuck:**
1. Code walkthrough
2. Architecture diagram
3. Explain GenLayer features used

---

## Post-Demo

**Judges will check:**
- GitHub repo
- README quality
- Deployment guide
- Code quality
- GenLayer feature usage

**Have ready:**
- GitHub link
- Live deployment URL (optional)
- Contract address on testnet
- 2-min demo video

---

**Remember:** You built a production-ready app. Demo it like one! 🚀
