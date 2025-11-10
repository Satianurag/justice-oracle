# 🚀 Deploy Justice Oracle to Testnet - RIGHT NOW

## Fastest Method (3 minutes)

GenLayer contracts deploy through Studio. Here's the quickest workflow:

---

## Step 1: Deploy Contract (2 min)

### Open Studio:
```bash
# This will open in your browser
xdg-open https://studio.genlayer.com/
```

**Or manually:** Go to https://studio.genlayer.com/

### In Studio:

1. **Sign up/Login** (30 sec)
   - Free account
   - Gets you 1000 test tokens automatically

2. **Create New Contract** (30 sec)
   - Click "New Contract" or "+"
   - Click "Upload File"
   - Select: `/home/sati/Desktop/justice-oracle/contracts/JusticeOracle.py`

3. **Deploy** (60 sec)
   - Click "Deploy" button
   - Select "Testnet"
   - Wait for confirmation
   - **COPY THE CONTRACT ADDRESS** (looks like `0x742d35Cc...`)

---

## Step 2: Configure Frontend (10 sec)

Back in your terminal:

```bash
cd /home/sati/Desktop/justice-oracle

# Use our helper script with your contract address
python3 configure_frontend.py 0xYOUR_CONTRACT_ADDRESS_HERE
```

**Example:**
```bash
python3 configure_frontend.py 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

---

## Step 3: Run Frontend (10 sec)

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

✅ See green "LIVE" indicator  
✅ See real stats from blockchain  
✅ File disputes for only 10 tokens!

---

## Alternative: Copy-Paste Method

If you prefer not to upload file:

### 1. Copy contract code:
```bash
cat contracts/JusticeOracle.py | xclip -selection clipboard
# Or just: cat contracts/JusticeOracle.py
# Then manually copy
```

### 2. In Studio:
- Click "New Contract"
- Paste code
- Click "Deploy"
- Copy address

### 3. Configure:
```bash
python3 configure_frontend.py 0xYOUR_ADDRESS
```

---

## What You'll Get

**Contract deployed with:**
- ✅ Super affordable: 10 token min stake
- ✅ Low fees: 1% platform fee
- ✅ AI-powered verdicts
- ✅ Web evidence scraping
- ✅ Precedent search (VectorStore)

**Free testnet tokens:**
- You get 1000 tokens on signup
- File 100 disputes with that!
- Get more at: https://faucet.genlayer.com/

---

## Verify Deployment

### Test in Studio Simulator:

```python
# Get contract stats
stats = contract.get_stats()
print(stats)

# Should show:
# {
#   "total_disputes": 0,
#   "min_stake": 10,
#   "platform_fee_percent": 1
# }
```

### Test in Frontend:

1. Open http://localhost:3000
2. Green "LIVE" indicator should show
3. Dashboard shows "10 tokens" min stake
4. Try filing a test dispute

---

## Troubleshooting

### "Cannot access Studio"
**Workaround:** Use manual configuration
```bash
cd frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_GENLAYER_RPC=https://studio.genlayer.com/api
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_ADDRESS
NEXT_PUBLIC_NETWORK=testnet
EOF
```

### "Deployment taking too long"
- Normal: Can take 60-90 seconds
- Studio shows progress bar
- Don't close the tab

### "Out of tokens"
```bash
# Get more free testnet tokens
xdg-open https://faucet.genlayer.com/
```

---

## Why Studio Method?

**GenLayer's deployment flow:**
- Studio validates Python syntax
- Checks GenLayer API compatibility  
- Handles all RPC authentication
- Manages testnet token allocation
- Provides built-in simulator

**Direct RPC calls** aren't supported for deployment (only for contract calls after deployment).

---

## Quick Reference

```bash
# 1. Deploy in Studio
open https://studio.genlayer.com/
# Upload contracts/JusticeOracle.py
# Click Deploy → Testnet
# Copy address

# 2. Configure frontend
python3 configure_frontend.py 0xADDRESS

# 3. Run
cd frontend && npm run dev

# 4. Demo!
open http://localhost:3000
```

**Total time: 3 minutes**  
**Total cost: FREE (testnet)**

---

🎉 **That's it! You're deploying a production-ready AI arbitration platform to blockchain in 3 minutes!**
