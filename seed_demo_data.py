#!/usr/bin/env python3
"""
Justice Oracle - Demo Data Seeder
Run this in GenLayer Studio to pre-populate realistic disputes before demo
"""

# Copy-paste this entire script into GenLayer Studio after deploying the contract

print("🌱 Seeding Justice Oracle with realistic demo data...")
print("=" * 60)

# Dispute 1: Resolved - Freelance Web Development Dispute
print("\n📝 Filing Dispute #1: Freelance Web Dev (Will resolve to plaintiff)")
dispute_1_id = contract.file_dispute(
    defendant_address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    case_description="I hired Bob on September 1, 2024 to build a responsive e-commerce website for $500, to be completed by October 1, 2024. The written agreement specified: 5 product pages with cart functionality, mobile-responsive design, admin panel for product management, and payment gateway integration. Bob delivered on October 22 (3 weeks late) with critical issues: navigation completely broken on mobile devices, only 2 of 5 product pages working, no admin panel whatsoever, cart functionality crashes on checkout, and no payment integration. I have requested fixes multiple times but Bob refuses, claiming the work is complete and demanding full payment. The site is completely unusable in its current state and fails to meet agreed specifications.",
    evidence_urls=[
        "https://github.com/bob-dev/alice-project/issues",
        "https://web.archive.org/web/20241001/contract-email",
        "https://pastebin.com/qa-test-report"
    ]
)
print(f"✅ Dispute #{dispute_1_id} filed")

print("\n📎 Adding evidence from both parties...")
contract.submit_evidence(
    dispute_1_id,
    "written_agreement",
    "Email chain from September 1 clearly documenting all deliverables: 5 product pages, mobile responsiveness, admin panel, payment gateway, October 1 deadline. Client paid $250 upfront, $250 on completion. All terms explicitly stated and acknowledged by Bob."
)

contract.submit_evidence(
    dispute_1_id,
    "technical_report",
    "Independent QA testing report shows 12 critical bugs: mobile navigation returns 404 errors, product pages 3-5 return empty data, admin login endpoint doesn't exist, cart throws JavaScript errors on checkout button click, no payment API integration found. Testing date: October 23, 2024."
)

contract.submit_evidence(
    dispute_1_id,
    "communication_log",
    "GitHub issue tracker shows Bob marked project 'complete' on October 22 despite 12 open critical bugs. Client requested fixes on Oct 23, 25, 28. Bob responded only once saying 'working as designed, scope creep not covered'."
)

print("✅ Evidence submitted")

print("\n⚖️  Resolving with AI verdict...")
verdict_1 = contract.resolve_dispute(dispute_1_id)
print(f"✅ Verdict: {verdict_1['verdict']}")
print(f"   Confidence: {verdict_1['confidence']}%")
print(f"   Distribution: {verdict_1['recommended_distribution']['plaintiff_percent']}% plaintiff / {verdict_1['recommended_distribution']['defendant_percent']}% defendant")

# Dispute 2: Active - Logo Design Copyright Dispute
print("\n📝 Filing Dispute #2: Logo Design (Will stay in evidence gathering)")
dispute_2_id = contract.file_dispute(
    defendant_address="0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    case_description="I commissioned a logo design from designer Sarah for my new startup for $300 on October 15, 2024, with delivery by October 25. Sarah delivered a logo on October 24, claiming it was 100% original work. However, I ran a reverse image search and found the exact same logo being sold as a template on multiple stock sites including Fiverr ($5), Creative Market ($12), and 99designs. The designer insists the design is original and that any similarities are coincidental. I want a full refund as I paid premium price for supposedly custom work but received a cheap template.",
    evidence_urls=[
        "https://tineye.com/search/logo-match-results",
        "https://fiverr.com/logo-templates/modern-tech-234",
        "https://twitter.com/designer-sarah/portfolio"
    ]
)
print(f"✅ Dispute #{dispute_2_id} filed")

print("\n📎 Adding plaintiff evidence...")
contract.submit_evidence(
    dispute_2_id,
    "image_comparison",
    "Reverse image search results from TinEye showing identical logo found on 8 different stock template sites. Earliest listing dated March 2023. Side-by-side comparison shows 100% match in colors, proportions, and design elements. Even the file metadata matches template versions."
)

contract.submit_evidence(
    dispute_2_id,
    "purchase_proof",
    "Invoice shows I paid $300 for 'custom original logo design' with contract terms stating 'all designs are original and copyright-free'. Template costs $5-12 on stock sites."
)

print("✅ Evidence submitted - leaving in evidence gathering state for demo")

# Dispute 3: Resolved - Smart Contract Audit Dispute (Split Ruling Expected)
print("\n📝 Filing Dispute #3: Smart Contract Audit (Will resolve to split)")
dispute_3_id = contract.file_dispute(
    defendant_address="0x5FbDB2315678afecb367f032d93F642f64180aa3",
    case_description="I hired BlockSec Auditors on September 20, 2024 to audit my DeFi smart contract for $800, delivered October 15. The audit report passed the contract with 'minor suggestions'. However, on October 28, the contract was exploited for $50,000 through a reentrancy vulnerability. The exploit used the exact pattern that should have been caught in audit. BlockSec claims they are not responsible for any vulnerabilities discovered after audit completion, but I had made zero code changes between audit and exploit. I'm seeking partial compensation as the audit failed to catch a critical vulnerability.",
    evidence_urls=[
        "https://github.com/myproject/audit-report-oct15.pdf",
        "https://etherscan.io/tx/exploit-0x7fb2",
        "https://github.com/myproject/commits?since=oct15"
    ]
)
print(f"✅ Dispute #{dispute_3_id} filed")

print("\n📎 Adding evidence from both parties...")
contract.submit_evidence(
    dispute_3_id,
    "audit_report",
    "Professional audit report dated October 15, 2024. Report shows tests run, coverage analysis, and security checks. Reentrancy section notes: 'Standard checks-effects-interactions pattern followed, no reentrancy risks identified.' Report includes 3 minor gas optimization suggestions, 0 critical issues."
)

contract.submit_evidence(
    dispute_3_id,
    "exploit_analysis",
    "On-chain transaction analysis shows exploit occurred October 28 via reentrancy attack in withdraw() function. GitHub commit history proves zero code changes between October 15 (audit) and October 28 (exploit). Same vulnerable code existed during audit period."
)

contract.submit_evidence(
    dispute_3_id,
    "industry_standard",
    "Smart contract audit industry standards: auditors are responsible for identifying vulnerabilities in reviewed code at time of audit. Post-audit changes are client responsibility. However, if vulnerability existed in audited code and was missed, auditor shares responsibility. Audits typically have 30-day bug report period."
)

print("✅ Evidence submitted")

print("\n⚖️  Resolving with AI verdict...")
verdict_3 = contract.resolve_dispute(dispute_3_id)
print(f"✅ Verdict: {verdict_3['verdict']}")
print(f"   Confidence: {verdict_3['confidence']}%")
print(f"   Distribution: {verdict_3['recommended_distribution']['plaintiff_percent']}% plaintiff / {verdict_3['recommended_distribution']['defendant_percent']}% defendant")

# Summary
print("\n" + "=" * 60)
print("✅ Demo data seeding complete!")
print("\nSummary:")
print(f"  • Dispute #{dispute_1_id}: Resolved (Freelance Web Dev)")
print(f"  • Dispute #{dispute_2_id}: Evidence Gathering (Logo Design)")
print(f"  • Dispute #{dispute_3_id}: Resolved (Smart Contract Audit)")
print("\n💡 Your frontend now has realistic data for demo!")
print("🎬 Ready to present!")
print("=" * 60)

# Get stats to verify
print("\n📊 Platform Stats:")
stats = contract.get_stats()
print(f"  Total Disputes: {stats['total_disputes']}")
print(f"  Total Evidence: {stats['total_evidence_submitted']}")
print(f"  Min Stake: {stats['min_stake']} tokens")
print(f"  Platform Fee: {stats['platform_fee_percent']}%")
