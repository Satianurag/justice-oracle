# 🖥️ Justice Oracle - Deploy from Terminal

## Why Terminal > Studio?

✅ **Faster** - One command deployment  
✅ **Automated** - No manual copy-paste  
✅ **Repeatable** - Same process every time  
✅ **Professional** - CLI workflow  

---

## 💰 Super Affordable Pricing

We made everything cheap so anyone can use it:

| Action | Cost |
|--------|------|
| **File Dispute** | 10 tokens (was 100) |
| **Submit Evidence** | ~1 token gas |
| **Platform Fee** | 1% (was 2%) |

**Example:** File dispute + 3 evidence = ~13 tokens total! 🎉

---

## 🚀 Option 1: Automated Deployment (Easiest)

### One command deploys everything:

```bash
# From project root
python3 deploy_local.py
```

**What it does:**
1. Reads your contract
2. Deploys to GenLayer testnet
3. Configures frontend automatically
4. Creates deployment_info.json

**Output:**
```
✅ Contract deployed!
📍 Address: 0x742d35Cc...
✅ Frontend configured
🎬 Ready to demo!
```

Then just:
```bash
cd frontend
npm run dev
```

---

## 🛠️ Option 2: Manual Deployment (More Control)

### Step 1: Deploy via Studio (2 min)

```bash
# Open Studio
https://studio.genlayer.com/

# Upload contract, click deploy, copy address
```

### Step 2: Configure Frontend (10 sec)

```bash
# From project root
python3 configure_frontend.py 0xYOUR_CONTRACT_ADDRESS
```

Done! Your `.env.local` is configured.

---

## 🔧 Option 3: Pure Manual (If Scripts Fail)

### Create `.env.local` manually:

```bash
cd frontend

cat > .env.local << 'EOF'
NEXT_PUBLIC_GENLAYER_RPC=https://studio.genlayer.com/api
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS_HERE
NEXT_PUBLIC_NETWORK=testnet
EOF

npm run dev
```

---

## 📝 Verify Deployment

### Test in Terminal:

```bash
# Check if frontend has contract address
cat frontend/.env.local

# Should show:
# NEXT_PUBLIC_CONTRACT_ADDRESS=0x742d35Cc...
```

### Test in Browser:

```bash
# Start frontend
cd frontend && npm run dev

# Open http://localhost:3000
# Look for green "LIVE" indicator in sidebar
```

### Test Contract Call:

In GenLayer Studio simulator:
```python
# Get stats
stats = contract.get_stats()
print(stats)

# Should show:
# {
#   "min_stake": 10,
#   "platform_fee_percent": 1,
#   "total_disputes": 0
# }
```

---

## 🌱 Seed Demo Data

Run this in GenLayer Studio **after** deploying:

```python
# File test dispute
dispute_id = contract.file_dispute(
    defendant_address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    case_description="Test dispute: freelancer failed to deliver website as specified in written agreement.",
    evidence_urls=["https://github.com/test/issue/1"]
)

print(f"Dispute #{dispute_id} filed!")

# Submit evidence
contract.submit_evidence(
    dispute_id,
    "written_agreement",
    "Contract clearly stated deliverables and deadline."
)

# Check in frontend - should appear in disputes table
```

---

## 💡 Pro Tips

### Multiple Deployments

```bash
# Deploy new version
python3 deploy_local.py

# Old contract address replaced automatically
# Frontend uses new contract immediately
```

### Switch Networks

```bash
# Edit deploy_local.py line 11:
NETWORK = "testnet"  # or "mainnet" when available
```

### Cost Comparison

**Before optimization:**
- File dispute: 100 tokens
- Platform fee: 2%
- Total for typical case: ~102 tokens

**After optimization:**
- File dispute: 10 tokens  
- Platform fee: 1%
- Total for typical case: ~12 tokens

**90% cheaper!** 🎉

---

## 🐛 Troubleshooting

### "Contract deployment failed"

**Try:**
```bash
# Check if you have testnet tokens
# Get more at: https://faucet.genlayer.com/

# Or use Studio as fallback
```

### "Frontend shows 'Contract not configured'"

**Fix:**
```bash
# Check .env.local exists
ls frontend/.env.local

# Check content
cat frontend/.env.local

# Should have NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# If missing, run:
python3 configure_frontend.py <your_address>
```

### "Import errors in deploy script"

**Fix:**
```bash
# Install requests
pip install requests

# Or use Studio
```

---

## 📊 Deployment Summary

**What you get:**

✅ Contract deployed to testnet  
✅ Frontend auto-configured  
✅ Super low prices (10 tokens)  
✅ deployment_info.json for reference  
✅ Ready to demo in 2 minutes  

**Files created:**
- `frontend/.env.local` - Auto-generated config
- `deployment_info.json` - Contract details

**Commands:**
```bash
# Deploy
python3 deploy_local.py

# Configure (if manual deploy)
python3 configure_frontend.py 0xADDRESS

# Run
cd frontend && npm run dev
```

---

## 🎬 Demo Workflow

```bash
# 1. Deploy contract
python3 deploy_local.py

# 2. Seed data (in Studio)
# Run seed_demo_data.py

# 3. Start frontend
cd frontend && npm run dev

# 4. Demo!
# Open http://localhost:3000
# Show live disputes
# File new one on camera
```

**Total time:** 5 minutes  
**Total cost:** ~10-30 tokens (FREE testnet)  

---

## 🚀 Why This is Better

**Studio Method:**
- Deploy in browser ⏱️ 2 min
- Copy address 📋 30 sec
- Paste in .env.local 📝 30 sec
- Restart frontend 🔄 30 sec
- **Total: ~4 minutes**

**Terminal Method:**
- Run deploy script ⚡ 1 min
- Auto-configured ✅ 0 sec
- **Total: ~1 minute**

**3x faster!** 🏎️

---

**Ready to deploy? Run:**

```bash
python3 deploy_local.py
```

🎉 **That's it!**
