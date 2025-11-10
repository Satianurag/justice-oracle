#!/usr/bin/env python3
"""
Quick frontend configuration script
Usage: python3 configure_frontend.py <contract_address>
"""

import sys
from pathlib import Path

if len(sys.argv) != 2:
    print("Usage: python3 configure_frontend.py <contract_address>")
    print("Example: python3 configure_frontend.py 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
    sys.exit(1)

contract_address = sys.argv[1]

if not contract_address.startswith("0x"):
    print("❌ Invalid address format. Should start with 0x")
    sys.exit(1)

print("⚙️  Configuring frontend...")

frontend_dir = Path("frontend")
env_file = frontend_dir / ".env.local"

env_content = f"""# Justice Oracle Configuration
# Contract deployed to GenLayer testnet

NEXT_PUBLIC_GENLAYER_RPC=https://studio.genlayer.com/api
NEXT_PUBLIC_CONTRACT_ADDRESS={contract_address}
NEXT_PUBLIC_NETWORK=testnet
"""

with open(env_file, "w") as f:
    f.write(env_content)

print(f"✅ Frontend configured!")
print(f"   Contract: {contract_address}")
print(f"   Config: {env_file}")
print()
print("Next steps:")
print("  cd frontend && npm run dev")
