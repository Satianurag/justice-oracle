# 🚀 Justice Oracle - Deployment Guide

## Overview

This guide will walk you through deploying the complete Justice Oracle application to production.

---

## Part 1: Deploy Smart Contract

### Step 1: Access GenLayer Studio

1. Go to https://studio.genlayer.com/
2. Create an account or sign in
3. Select "New Contract"

### Step 2: Upload Contract

1. Click "Upload File"
2. Select `contracts/JusticeOracle.py`
3. Or copy-paste the contract code

### Step 3: Deploy

1. Click "Deploy"
2. Select network: **Testnet** (recommended) or **Mainnet**
3. Wait for deployment (may take 1-2 minutes)
4. **IMPORTANT:** Copy the contract address shown after deployment

Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

### Step 4: Test Contract

Test in Studio simulator:

```python
# File dispute
dispute_id = contract.file_dispute(
    defendant_address="0x...",
    case_description="Your case description here (min 50 chars)...",
    evidence_urls=["https://github.com/user/repo/issues/1"]
)

# Submit evidence
contract.submit_evidence(0, "written_agreement", "Evidence content...")

# Get dispute
dispute = contract.get_dispute(0)
print(dispute)
```

---

## Part 2: Configure Frontend

### Step 1: Environment Variables

Create `/frontend/.env.local`:

```bash
NEXT_PUBLIC_GENLAYER_RPC=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_CONTRACT_ADDRESS_FROM_STEP3>
NEXT_PUBLIC_NETWORK=testnet
```

**Replace `<YOUR_CONTRACT_ADDRESS_FROM_STEP3>` with actual address!**

### Step 2: Install Dependencies

```bash
cd frontend
npm install
```

### Step 3: Test Locally

```bash
npm run dev
```

Open http://localhost:3000

You should see:
- ✅ "GenLayer Connected" badge (green)
- ✅ Stats loading from contract
- ✅ Disputes table working

---

## Part 3: Deploy Frontend (Production)

### Option A: Vercel (Recommended)

1. Push code to GitHub

2. Go to https://vercel.com/new

3. Import repository

4. Configure Environment Variables:
   ```
   NEXT_PUBLIC_GENLAYER_RPC=<PRODUCTION_RPC_URL>
   NEXT_PUBLIC_CONTRACT_ADDRESS=<CONTRACT_ADDRESS>
   NEXT_PUBLIC_NETWORK=mainnet
   ```

5. Click "Deploy"

6. Domain will be: `https://justice-oracle-xxx.vercel.app`

### Option B: Build & Self-Host

```bash
cd frontend
npm run build
npm start
```

Or use:
- Netlify
- Cloudflare Pages
- AWS Amplify
- Your own server

---

## Part 4: Verification Checklist

### Contract Verification

- [ ] Contract deployed to GenLayer
- [ ] Can call `get_stats()`
- [ ] Can file test dispute
- [ ] Contract address saved

### Frontend Verification

- [ ] `.env.local` configured correctly
- [ ] "GenLayer Connected" badge shows green
- [ ] Stats load from contract (not 0/0/0/0)
- [ ] Can navigate all pages
- [ ] Forms show proper validation
- [ ] No console errors

### Integration Verification

- [ ] Can file dispute from UI
- [ ] Transaction toast appears
- [ ] Dispute appears in table
- [ ] Can submit evidence
- [ ] All actions trigger blockchain calls

---

## Troubleshooting

### "Contract not configured"

**Problem:** `NEXT_PUBLIC_CONTRACT_ADDRESS` not set or wrong

**Fix:**
1. Check `.env.local` exists in `/frontend/`
2. Verify contract address is correct (starts with `0x`)
3. Restart dev server: `npm run dev`

### "Failed to load disputes"

**Problem:** RPC connection issue

**Fix:**
1. Check `NEXT_PUBLIC_GENLAYER_RPC` in `.env.local`
2. For testnet: Use Studio's RPC endpoint
3. Check network connectivity

### Stats showing 0/0/0/0

**Problem:** Contract is deployed but has no data

**Fix:** This is normal for new deployments! File a test dispute to populate.

### "Failed to file dispute"

**Problem:** Contract call rejected

**Possible causes:**
1. Insufficient stake (min 100 tokens)
2. Invalid defendant address
3. Case description too short (<50 chars)
4. Too many evidence URLs (>5)

---

## Production Checklist

Before going live:

- [ ] Deploy contract to **Mainnet** (not testnet)
- [ ] Update `.env.local` with mainnet RPC
- [ ] Set production domain in Vercel/hosting
- [ ] Test full flow end-to-end
- [ ] Add error monitoring (Sentry)
- [ ] Set up analytics
- [ ] Create demo video
- [ ] Submit to hackathon!

---

## Support

**GenLayer Docs:** https://docs.genlayer.com/
**Studio:** https://studio.genlayer.com/

## Next Steps

1. ✅ Contract deployed
2. ✅ Frontend running
3. 📝 Create demo video (2 min)
4. 🎬 Record walkthrough
5. 🏆 Submit to hackathon

---

**🎉 You're ready for production!**
