# { "Depends": "py-genlayer:test" }

from genlayer import *
from dataclasses import dataclass
import json

@allow_storage
@dataclass
class Dispute:
    dispute_id: u256
    plaintiff: Address
    defendant: Address
    case_description: str
    evidence_urls: str  # Serialized as "url1|||url2|||url3"
    stake_amount: u256
    status: str
    verdict: str
    reasoning: str
    confidence_score: u8
    plaintiff_distribution: u8
    defendant_distribution: u8

@allow_storage
@dataclass
class Evidence:
    evidence_id: u256
    dispute_id: u256
    submitted_by: Address
    evidence_type: str
    content: str
    credibility_score: u8

class JusticeOracle(gl.Contract):
    disputes: TreeMap[u256, Dispute]
    evidence: TreeMap[u256, Evidence]
    dispute_counter: u256
    evidence_counter: u256
    platform_fee: u256
    min_stake: u256
    max_evidence_urls: u256
    
    def __init__(self):
        self.dispute_counter = u256(0)
        self.evidence_counter = u256(0)
        self.platform_fee = u256(1)  # 1% - super low fee
        self.min_stake = u256(10)  # Only 10 tokens to file - very affordable
        self.max_evidence_urls = u256(5)  # Max 5 URLs per dispute
    
    def _serialize_urls(self, evidence_urls: list) -> str:
        """Convert list to pipe-delimited string for storage"""
        return "|||".join(evidence_urls) if evidence_urls else ""
    
    def _deserialize_urls(self, serialized: str) -> list:
        """Convert serialized string back to list"""
        if not serialized:
            return []
        return serialized.split("|||")
    
    @gl.public.write.payable
    def file_dispute(
        self,
        defendant_address: str,
        case_description: str,
        evidence_urls: list
    ) -> u256:
        """File a new dispute with case description and evidence URLs (requires stake)"""
        
        # Validate inputs
        if len(case_description) < 50:
            raise Exception("Case description must be at least 50 characters")
        
        if len(case_description) > 5000:
            raise Exception("Case description too long (max 5000 characters)")
        
        if len(evidence_urls) > int(self.max_evidence_urls):
            raise Exception(f"Too many evidence URLs (max {int(self.max_evidence_urls)})")
        
        # Validate stake amount
        if gl.message.value < self.min_stake:
            raise Exception(f"Minimum stake is {int(self.min_stake)} tokens")
        
        dispute_id = self.dispute_counter
        self.dispute_counter = self.dispute_counter + u256(1)
        
        defendant = Address(defendant_address)
        
        dispute = Dispute(
            dispute_id=dispute_id,
            plaintiff=gl.message.sender_address,
            defendant=defendant,
            case_description=case_description,
            evidence_urls=self._serialize_urls(evidence_urls),  # Serialize to string
            stake_amount=gl.message.value,
            status="evidence_gathering",
            verdict="",
            reasoning="",
            confidence_score=u8(0),
            plaintiff_distribution=u8(0),
            defendant_distribution=u8(0)
        )
        
        self.disputes[dispute_id] = dispute
        
        return dispute_id
    
    @gl.public.write
    def submit_evidence(
        self,
        dispute_id: u256,
        evidence_type: str,
        content: str
    ) -> u256:
        """Submit additional evidence for a dispute"""
        
        dispute = self.disputes.get(dispute_id)
        if not dispute:
            raise Exception("Dispute not found")
        
        if dispute.status != "evidence_gathering":
            raise Exception("Evidence gathering period closed")
        
        if gl.message.sender_address != dispute.plaintiff and gl.message.sender_address != dispute.defendant:
            raise Exception("Only parties can submit evidence")
        
        if len(content) > 10000:
            raise Exception("Evidence content too long (max 10000 characters)")
        
        credibility = self._verify_evidence_credibility(content, evidence_type, dispute.case_description)
        
        evidence_id = self.evidence_counter
        self.evidence_counter = self.evidence_counter + u256(1)
        
        evidence = Evidence(
            evidence_id=evidence_id,
            dispute_id=dispute_id,
            submitted_by=gl.message.sender_address,
            evidence_type=evidence_type,
            content=content,
            credibility_score=credibility
        )
        
        self.evidence[evidence_id] = evidence
        return evidence_id
    
    @gl.public.write
    def resolve_dispute(self, dispute_id: u256) -> dict:
        """
        AI-powered dispute resolution with multi-LLM consensus
        Uses custom validator to ensure high-quality judicial reasoning
        """
        
        dispute = self.disputes.get(dispute_id)
        if not dispute:
            raise Exception("Dispute not found")
        
        if dispute.status != "evidence_gathering":
            raise Exception("Dispute not ready for resolution")
        
        all_evidence = self._gather_comprehensive_evidence(dispute_id)
        
        verdict_data = self._ai_judicial_analysis(dispute, all_evidence)
        
        dispute.verdict = verdict_data["verdict"]
        dispute.reasoning = verdict_data["reasoning"]
        dispute.confidence_score = u8(verdict_data["confidence"])
        dispute.plaintiff_distribution = u8(verdict_data["recommended_distribution"]["plaintiff_percent"])
        dispute.defendant_distribution = u8(verdict_data["recommended_distribution"]["defendant_percent"])
        dispute.status = "resolved"
        
        self.disputes[dispute_id] = dispute
        
        # Distribute funds based on verdict
        self._distribute_funds(dispute_id)
        
        return verdict_data
    
    def _gather_comprehensive_evidence(self, dispute_id: u256) -> dict:
        """Fetch evidence from multiple sources including web scraping"""
        
        dispute = self.disputes.get(dispute_id)
        evidence_collection = {
            "web_evidence": [],
            "submitted_evidence": []
        }
        
        # Deserialize URLs for iteration
        evidence_urls = self._deserialize_urls(dispute.evidence_urls)
        
        # Gather web evidence with resource limits
        url_count = 0
        for url in evidence_urls:
            if url_count >= int(self.max_evidence_urls):
                break
            try:
                web_data = gl.nondet.web.render(url, mode="text")
                evidence_collection["web_evidence"].append({
                    "url": url,
                    "content": web_data[:1500]  # Limit content size
                })
                url_count += 1
            except Exception as e:
                evidence_collection["web_evidence"].append({
                    "url": url,
                    "content": f"Failed to fetch: {str(e)}"
                })
        
        # Gather submitted evidence
        for i in range(int(self.evidence_counter)):
            evidence = self.evidence.get(u256(i))
            if evidence and evidence.dispute_id == dispute_id:
                evidence_collection["submitted_evidence"].append({
                    "type": evidence.evidence_type,
                    "content": evidence.content[:2000],  # Limit content size
                    "credibility": int(evidence.credibility_score),
                    "submitted_by": "plaintiff" if evidence.submitted_by == dispute.plaintiff else "defendant"
                })
        
        return evidence_collection
    
    def _ai_judicial_analysis(self, dispute: Dispute, evidence: dict) -> dict:
        """
        Multi-LLM consensus with custom validator for judicial quality
        This showcases GenLayer's unique capability for subjective decision-making
        """
        
        def leader_fn():
            prompt = f"""You are a decentralized arbitration AI analyzing a dispute fairly and objectively.

CASE DESCRIPTION:
{dispute.case_description}

PLAINTIFF: {dispute.plaintiff.as_hex}
DEFENDANT: {dispute.defendant.as_hex}

EVIDENCE COLLECTED:
Web Evidence: {json.dumps(evidence.get("web_evidence", []), indent=2)}
Submitted Evidence: {json.dumps(evidence.get("submitted_evidence", []), indent=2)}

PROVIDE A VERDICT IN STRICT JSON FORMAT:
{{
    "verdict": "plaintiff_wins" | "defendant_wins" | "split_ruling" | "insufficient_evidence",
    "confidence": <integer 0-100>,
    "reasoning": "<detailed 300-500 word explanation>",
    "key_factors": ["factor1", "factor2", "factor3"],
    "evidence_weight": {{
        "plaintiff_evidence_strength": <integer 0-10>,
        "defendant_evidence_strength": <integer 0-10>
    }},
    "recommended_distribution": {{
        "plaintiff_percent": <integer 0-100>,
        "defendant_percent": <integer 0-100>
    }}
}}

CRITICAL REQUIREMENTS:
1. Your reasoning MUST be 300-500 words
2. Be impartial and evidence-based
3. Cite specific evidence in your reasoning
4. Distribution percentages must sum to 100
5. Confidence must be 0-100
6. Include at least 3 key factors

Return ONLY valid JSON, no markdown, no code blocks."""
            
            result = gl.nondet.exec_prompt(prompt, response_format="json")
            cleaned = str(result).replace("```json", "").replace("```", "").strip()
            return cleaned
        
        def validator_fn(leader_result):
            """Custom validator ensures high-quality judicial reasoning"""
            
            if not isinstance(leader_result, gl.vm.Return):
                return False
            
            try:
                verdict_data = json.loads(leader_result.calldata)
                
                required_fields = [
                    "verdict", "confidence", "reasoning",
                    "key_factors", "evidence_weight", "recommended_distribution"
                ]
                if not all(field in verdict_data for field in required_fields):
                    return False
                
                valid_verdicts = ["plaintiff_wins", "defendant_wins", "split_ruling", "insufficient_evidence"]
                if verdict_data["verdict"] not in valid_verdicts:
                    return False
                
                confidence = int(verdict_data["confidence"])
                if not (0 <= confidence <= 100):
                    return False
                
                word_count = len(verdict_data["reasoning"].split())
                if word_count < 250 or word_count > 600:
                    return False
                
                if len(verdict_data["key_factors"]) < 2:
                    return False
                
                dist = verdict_data["recommended_distribution"]
                plaintiff_pct = int(dist["plaintiff_percent"])
                defendant_pct = int(dist["defendant_percent"])
                
                if not (0 <= plaintiff_pct <= 100 and 0 <= defendant_pct <= 100):
                    return False
                
                if plaintiff_pct + defendant_pct != 100:
                    return False
                
                ev_weight = verdict_data["evidence_weight"]
                p_strength = int(ev_weight["plaintiff_evidence_strength"])
                d_strength = int(ev_weight["defendant_evidence_strength"])
                
                if not (0 <= p_strength <= 10 and 0 <= d_strength <= 10):
                    return False
                
                reasoning_lower = verdict_data["reasoning"].lower()
                bias_keywords = ["obviously", "clearly wrong", "stupid", "idiot", "moron"]
                if any(keyword in reasoning_lower for keyword in bias_keywords):
                    return False
                
                return True
                
            except (json.JSONDecodeError, ValueError, KeyError, TypeError) as e:
                return False
        
        result_json = gl.vm.run_nondet(leader_fn, validator_fn)
        return json.loads(result_json)
    
    def _verify_evidence_credibility(self, content: str, evidence_type: str, case_context: str) -> u8:
        """AI verifies evidence credibility score 0-100"""
        
        prompt = f"""Rate the credibility of this evidence on a scale of 0-100:

Evidence Type: {evidence_type}
Content: {content[:500]}
Case Context: {case_context[:200]}

Consider:
1. Source reliability
2. Relevance to case
3. Potential for manipulation
4. Internal consistency
5. Specificity and detail

Return ONLY an integer between 0 and 100, nothing else."""
        
        result = gl.nondet.exec_prompt(prompt)
        
        try:
            score = int(str(result).strip())
            return u8(min(100, max(0, score)))
        except:
            return u8(50)
    
    def _distribute_funds(self, dispute_id: u256) -> None:
        """Distribute staked funds based on verdict"""
        
        dispute = self.disputes.get(dispute_id)
        if not dispute:
            return
        
        total_stake = dispute.stake_amount
        platform_fee_amount = (total_stake * self.platform_fee) / u256(100)
        distributable_amount = total_stake - platform_fee_amount
        
        # Calculate amounts based on distribution percentages
        plaintiff_amount = (distributable_amount * u256(dispute.plaintiff_distribution)) / u256(100)
        defendant_amount = (distributable_amount * u256(dispute.defendant_distribution)) / u256(100)
        
        # Transfer funds to parties
        if plaintiff_amount > u256(0):
            gl.transfer(dispute.plaintiff, plaintiff_amount)
        
        if defendant_amount > u256(0):
            gl.transfer(dispute.defendant, defendant_amount)
        
        # Platform fee stays in contract
        # Note: In production, add admin withdrawal method for accumulated fees
    
    @gl.public.write
    def appeal_verdict(self, dispute_id: u256, appeal_reason: str) -> None:
        """Appeal a resolved verdict - showcases Optimistic Democracy"""
        
        dispute = self.disputes.get(dispute_id)
        if not dispute:
            raise Exception("Dispute not found")
        
        if dispute.status != "resolved":
            raise Exception("Can only appeal resolved disputes")
        
        if len(appeal_reason) < 100:
            raise Exception("Appeal reason must be at least 100 characters")
        
        dispute.status = "appealed"
        dispute.verdict = ""
        dispute.reasoning = f"APPEALED: {appeal_reason}"
        
        self.disputes[dispute_id] = dispute
    
    @gl.public.view
    def get_dispute(self, dispute_id: u256) -> dict:
        """Get full dispute details"""
        
        dispute = self.disputes.get(dispute_id)
        if not dispute:
            return {}
        
        return {
            "dispute_id": int(dispute.dispute_id),
            "plaintiff": dispute.plaintiff.as_hex,
            "defendant": dispute.defendant.as_hex,
            "case_description": dispute.case_description,
            "evidence_urls": self._deserialize_urls(dispute.evidence_urls),  # Deserialize to list
            "stake_amount": int(dispute.stake_amount),
            "status": dispute.status,
            "verdict": dispute.verdict,
            "reasoning": dispute.reasoning,
            "confidence": int(dispute.confidence_score),
            "distribution": {
                "plaintiff_percent": int(dispute.plaintiff_distribution),
                "defendant_percent": int(dispute.defendant_distribution)
            }
        }
    
    @gl.public.view
    def get_dispute_evidence(self, dispute_id: u256) -> list:
        """Get all submitted evidence for a dispute"""
        
        evidence_list = []
        
        for i in range(int(self.evidence_counter)):
            evidence = self.evidence.get(u256(i))
            if evidence and evidence.dispute_id == dispute_id:
                evidence_list.append({
                    "evidence_id": int(evidence.evidence_id),
                    "submitted_by": evidence.submitted_by.as_hex,
                    "type": evidence.evidence_type,
                    "content": evidence.content,
                    "credibility": int(evidence.credibility_score)
                })
        
        return evidence_list
    
    @gl.public.view
    def get_all_disputes(self) -> list:
        """Get all disputes in the system"""
        
        disputes_list = []
        
        for i in range(int(self.dispute_counter)):
            dispute = self.disputes.get(u256(i))
            if dispute:
                disputes_list.append({
                    "dispute_id": int(dispute.dispute_id),
                    "plaintiff": dispute.plaintiff.as_hex,
                    "defendant": dispute.defendant.as_hex,
                    "status": dispute.status,
                    "verdict": dispute.verdict
                })
        
        return disputes_list
    
    @gl.public.view
    def get_stats(self) -> dict:
        """Get platform statistics"""
        
        return {
            "total_disputes": int(self.dispute_counter),
            "total_evidence_submitted": int(self.evidence_counter),
            "min_stake": int(self.min_stake),
            "platform_fee_percent": int(self.platform_fee)
        }
