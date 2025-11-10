# 🏛️ Justice Oracle - AI-Powered Decentralized Arbitration

**GenLayer Hackathon Project - Onchain Justice Track**

A production-ready dispute resolution platform leveraging GenLayer's Intelligent Contracts for fair, transparent, and AI-powered arbitration on-chain.

**Status:** ✅ Production Ready - Contract & Frontend Complete

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+ (for contract)
- Node.js 18+ (for frontend)
- GenLayer Studio account

### Deploy Smart Contract

1. Open [GenLayer Studio](https://studio.genlayer.com/)
2. Upload `contracts/JusticeOracle.py`
3. Deploy to testnet
4. Copy the contract address

### Run Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_GENLAYER_RPC=http://localhost:8545" > .env.local
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=<your_contract_address>" >> .env.local
echo "NEXT_PUBLIC_NETWORK=testnet" >> .env.local

npm run dev
```

Open http://localhost:3000

---

## 🌟 Project Overview

Justice Oracle is a decentralized arbitration platform powered by GenLayer's Intelligent Contracts. It uses multi-LLM consensus to resolve disputes fairly, transparently, and at machine speed.

## 🎯 What Makes This Special

This project showcases **EVERY** GenLayer unique capability:

### ✅ Features No Other Submission Has:
- **Custom Validator Logic** - 8-point judicial quality validation
- **Multi-Source Evidence** - Web scraping + user submissions + credibility AI
- **Subjective Reasoning** - AI makes fairness judgments (impossible on Ethereum)
- **Appeal Mechanism** - Showcases Optimistic Democracy
- **Complete Lifecycle** - File → Evidence → Resolution → Appeal

### ✅ GenLayer Capabilities Demonstrated:
1. **gl.nondet.web.render()** - Scrapes evidence from URLs
2. **gl.nondet.exec_prompt()** - AI analyzes evidence and credibility
3. **gl.vm.run_nondet()** - Custom consensus with validator logic
4. **Optimistic Democracy** - Appeal triggers re-evaluation
5. **Complex State Management** - TreeMap storage for disputes/evidence
6. **Transparent AI** - Full reasoning stored on-chain

## 🏗️ Architecture

### Smart Contract (350+ lines)
- **Dispute Management** - File, track, resolve disputes
- **Evidence System** - Submit evidence with AI credibility scoring
- **AI Resolution** - Multi-LLM consensus with custom validation
- **Appeal Process** - Challenge verdicts (Optimistic Democracy)

### Key Components:

#### Dispute Structure
```python
@dataclass
class Dispute:
    dispute_id: u256
    plaintiff: Address
    defendant: Address
    case_description: str
    evidence_urls: list
    stake_amount: u256
    status: str  # evidence_gathering → resolved → appealed
    verdict: str
    reasoning: str
    confidence_score: u8
    plaintiff_distribution: u8
    defendant_distribution: u8
```

#### Evidence Structure
```python
@dataclass
class Evidence:
    evidence_id: u256
    dispute_id: u256
    submitted_by: Address
    evidence_type: str
    content: str
    credibility_score: u8  # AI-calculated 0-100
```

## 🚀 How It Works

### 1. File Dispute
```python
dispute_id = contract.file_dispute(
    defendant_address="0x...",
    case_description="Bob delivered incomplete work...",
    evidence_urls=[
        "https://github.com/bob/project/issues",
        "https://chat-logs.example.com/agreement"
    ]
)
```

### 2. Submit Evidence
```python
# Both parties can submit additional evidence
evidence_id = contract.submit_evidence(
    dispute_id=0,
    evidence_type="contract_agreement",
    content="Written agreement showing deliverables..."
)
# AI automatically scores credibility 0-100
```

### 3. AI Resolution
```python
verdict = contract.resolve_dispute(dispute_id=0)

# Process:
# 1. Scrapes all evidence URLs
# 2. Collects submitted evidence (weighted by credibility)
# 3. AI Leader generates verdict with reasoning
# 4. Validators check quality (8 validation rules)
# 5. Consensus reached → verdict stored on-chain

# Returns:
{
    "verdict": "plaintiff_wins",
    "confidence": 78,
    "reasoning": "Based on evidence, plaintiff's claims are substantiated...",
    "key_factors": [
        "Contract clearly specified deliverables",
        "GitHub shows incomplete features",
        "No evidence of requirement changes"
    ],
    "evidence_weight": {
        "plaintiff_evidence_strength": 9,
        "defendant_evidence_strength": 3
    },
    "recommended_distribution": {
        "plaintiff_percent": 85,
        "defendant_percent": 15
    }
}
```

### 4. Appeal (Optional)
```python
contract.appeal_verdict(
    dispute_id=0,
    appeal_reason="AI didn't consider evidence of changed requirements..."
)
# Triggers new evaluation round (Optimistic Democracy)
```

## 🧠 AI Consensus Magic

### Custom Validator Ensures Quality:
```python
def validator_fn(leader_result):
    # Validates:
    ✓ Correct verdict format
    ✓ Confidence score 0-100
    ✓ Reasoning 250-600 words
    ✓ At least 2 key factors
    ✓ Distribution sums to 100%
    ✓ Evidence weights 0-10
    ✓ No bias language
    ✓ Valid JSON structure
    
    # Rejects low-quality AI outputs
    # Ensures fair, thorough analysis
```

## 📊 Contract Methods

### Write Methods
- `file_dispute()` - Create new dispute
- `submit_evidence()` - Add evidence (both parties)
- `resolve_dispute()` - Trigger AI resolution
- `appeal_verdict()` - Challenge decision

### View Methods
- `get_dispute(dispute_id)` - Full dispute details
- `get_dispute_evidence(dispute_id)` - All evidence list
- `get_all_disputes()` - Platform disputes
- `get_stats()` - Platform statistics

## 🎮 Testing

### Run Test Suite:
```bash
python test_justice_oracle.py
```

### Test Scenarios Covered:
1. **File Dispute** - Basic dispute creation
2. **Submit Evidence** - Multi-party evidence submission
3. **AI Resolution** - Complete resolution flow
4. **Appeal Process** - Verdict challenge
5. **View Methods** - Read operations
6. **Edge Cases** - Error handling
7. **Validator Logic** - Consensus quality checks

## 🏆 Why This Wins

### 1. Uses Features NO ONE Else Used:
- Custom validator with 8 quality checks
- Multi-source evidence aggregation
- AI credibility scoring
- Appeal mechanism (Optimistic Democracy)

### 2. Showcases Platform Capabilities:
- **Can't do this on Ethereum** - Subjective "fairness" decisions
- **Can't do this centrally** - Transparent, immutable reasoning
- **Can't do this without AI** - Natural language understanding

### 3. Real-World Use Case:
- P2P marketplace disputes
- Freelance contract conflicts  
- DAO governance arbitration
- DeFi protocol disputes

### 4. Production Quality:
- 350+ lines of robust code
- Comprehensive error handling
- Complete state management
- Extensive validation

## 🎯 Use Cases

1. **Freelance Disputes** - "Developer didn't deliver as promised"
2. **P2P Trades** - "Seller didn't ship item"
3. **DAO Conflicts** - "Proposal execution disagreement"
4. **DeFi Issues** - "Smart contract behavior dispute"
5. **NFT Trades** - "Artwork quality disagreement"

## 📈 Future Enhancements

- Vector Store for precedent search
- Multi-signature evidence verification
- Reputation system for parties
- Staking/slashing for false claims
- Integration with escrow contracts

## 🔧 Technical Stack

- **Language**: Python (GenLayer SDK)
- **Consensus**: Optimistic Democracy with custom validators
- **AI**: Multi-LLM reasoning via gl.nondet
- **Storage**: TreeMap (disputes, evidence)
- **Web Access**: gl.nondet.web.render()

## 🚀 Deployment

### GenLayer Studio:
1. Open https://studio.genlayer.com/
2. Load `contracts/JusticeOracle.py`
3. Click "Deploy"
4. Test with multiple validators
5. Observe AI consensus in action

### Contract Address:
```
[To be deployed on GenLayer Testnet]
```

## 📝 License

MIT License - Built for GenLayer Hackathon Nov 2024

## 🙏 Acknowledgments

Built using GenLayer's revolutionary Intelligent Contracts platform that brings AI reasoning to blockchain consensus.

---

**Justice Oracle - Where AI Meets Justice, Trustlessly.**
