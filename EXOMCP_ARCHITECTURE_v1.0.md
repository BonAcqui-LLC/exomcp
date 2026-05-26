# ExoMCP — Full System Architecture v1.0
**BonAcqui LLC / ExoMCP**  
**Date:** 2026-05-26  
**Classification:** Internal — NDA required for partner disclosure  
**Status:** Architecture complete, build phase beginning

---

## The One-Paragraph Version

ExoMCP is a distributed, anonymous, multi-node AI behavioral integrity system that monitors other AI systems for logic failure, drift, goal substitution, and recursive capability accumulation. Analysis is performed by rotating Canon-role nodes running on free/open LLM infrastructure — each node sees only its assigned slice, knows only its role, and cannot identify the other nodes. Results are assembled by a Synth layer that maps findings to a unified taxonomy derived from every major public AI safety and security framework (OWASP, NIST, MITRE, EU AI Act, CISA, ENISA). Output is an audit-grade behavioral integrity report delivered via MCP-compatible API. The engine is invisible. The interface is universal. The attack surface is near-zero because the monitor itself is a moving target.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTERFACE                        │
│              ExoMCP MCP Server (exomcp.com/api)             │
│         API-key auth · Standard MCP protocol · HTTPS        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    INTAKE GATEWAY                            │
│              Cloudflare Worker (exomcp-gateway)              │
│   Auth · Rate limit · Session ID · Input normalization       │
│   Strips PII · Logs metadata only · No plaintext storage     │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────┐          ┌───────────────────────────┐
│   TAXONOMY ENGINE    │          │    DISPATCH ORCHESTRATOR   │
│  (Cloudflare Worker) │          │    (Cloudflare Worker)     │
│                      │          │                            │
│ Ingests + normalizes │          │ Assigns Canon roles to     │
│ public frameworks:   │          │ randomly selected LLM      │
│ · OWASP LLM Top 10   │          │ nodes from rotation pool.  │
│ · NIST AI RMF        │          │ Each node gets:            │
│ · MITRE ATLAS        │          │ · Its role prompt only     │
│ · EU AI Act Annex III│          │ · Its input slice only     │
│ · CISA AI Guidance   │          │ · No session context       │
│ · ENISA AI Threats   │          │ · No other node IDs        │
│ · ISO/IEC 42001      │          │                            │
│                      │          │ Returns: structured JSON   │
│ Output: unified      │          │ verdict per node           │
│ detection taxonomy   │          └──────────┬────────────────┘
│ stored in KV         │                     │
└──────────────────────┘                     ▼
                              ┌──────────────────────────────┐
                              │     CANON NODE POOL          │
                              │   (Rotating Free LLM Tier)   │
                              │                              │
                              │  Node assignments per run:   │
                              │                              │
                              │  [ADVERSARY]                 │
                              │  Gemini Flash / Groq-Llama   │
                              │  → Scans for RSI indicators, │
                              │    capability accumulation,  │
                              │    boundary laundering       │
                              │                              │
                              │  [ETHICIST]                  │
                              │  Mistral Free / Qwen         │
                              │  → Alignment theater,        │
                              │    value drift, constraint   │
                              │    erosion patterns          │
                              │                              │
                              │  [MECHANIC]                  │
                              │  Groq-Mixtral / Gemma        │
                              │  → Tool-scope drift,         │
                              │    authority creep,          │
                              │    permission footprint      │
                              │                              │
                              │  [ARCHIVIST]                 │
                              │  Cohere Command-R / Qwen     │
                              │  → Longitudinal drift,       │
                              │    baseline deviation,       │
                              │    memory contamination      │
                              │                              │
                              │  [STRATEGIST]                │
                              │  Mistral / Llama             │
                              │  → Goal substitution,        │
                              │    causal laundering,        │
                              │    objective topology        │
                              │                              │
                              │  [SECURITY SENTINEL]         │
                              │  Separate provider always    │
                              │  → Full read, one-way output │
                              │    Cannot communicate with   │
                              │    other nodes. Watches for  │
                              │    compromise of the monitor │
                              │    itself.                   │
                              │                              │
                              │  Node selection: random per  │
                              │  request. Provider rotates   │
                              │  on schedule. No node knows  │
                              │  its siblings.               │
                              └──────────┬───────────────────┘
                                         │
                                         ▼
                              ┌──────────────────────────────┐
                              │         SYNTH LAYER          │
                              │    (Cloudflare Worker)       │
                              │                              │
                              │  Receives all node verdicts. │
                              │  Arbitrates conflicts.       │
                              │  Maps findings → taxonomy.   │
                              │  Computes aggregate score.   │
                              │  Generates audit report.     │
                              │  Classifies severity.        │
                              │  Recommends interventions.   │
                              │                              │
                              │  Output format:              │
                              │  · Executive summary         │
                              │  · Per-finding detail        │
                              │  · Framework citations       │
                              │  · Intervention ladder       │
                              │  · Case ID + audit hash      │
                              └──────────┬───────────────────┘
                                         │
                                         ▼
                              ┌──────────────────────────────┐
                              │       REPORT DELIVERY        │
                              │                              │
                              │  → JSON (API response)       │
                              │  → Structured audit report   │
                              │  → Webhook (enterprise)      │
                              │  → D1 log (append-only)      │
                              └──────────────────────────────┘
```

---

## Layer 1: ExoMCP MCP Server (Public Interface)

**Protocol:** Model Context Protocol (MCP) standard  
**Transport:** HTTPS / SSE  
**Auth:** API key per org, manually provisioned during early access  
**Host:** Cloudflare Worker — exomcp.com/api/mcp  

### Exposed Tools

```
analyze_session(session_transcript, context_metadata)
  → Behavioral integrity analysis across all Canon roles
  → Returns: integrity_score, findings[], framework_citations[], intervention_ladder

check_indicators(content, content_type)
  → content_type: "prompt" | "agent_state" | "memory_entry" | "tool_call" | "output"
  → Returns: indicator_flags[], severity, rsi_risk_score, recommended_action

get_taxonomy(framework?)
  → Returns: unified detection taxonomy, optionally filtered by framework
  → Includes: OWASP, NIST, MITRE, EU AI Act, CISA, ENISA mappings

report_incident(session_id, finding_summary, severity)
  → Creates append-only incident record in D1
  → Returns: case_id, audit_hash, timestamp

get_frameworks()
  → Returns: list of ingested public frameworks with version + date

ping()
  → Health check, returns node pool status (anonymous — no provider IDs)
```

---

## Layer 2: Intake Gateway

**Purpose:** The only layer that touches raw input. Strips, normalizes, protects.

- Validates API key, returns 401 on fail
- Assigns session UUID (no PII, no source IP in logs)
- Normalizes input to canonical JSON schema
- Splits input into role-appropriate slices for dispatch
- Hard limits: 50k tokens max input, 10 tool calls/min per key
- Logs: timestamp, session_id, input_length, key_hash only — no content

**Critical property:** No plaintext session content is ever stored. Logs are metadata only.

---

## Layer 3: Taxonomy Engine

**Purpose:** Single source of truth for what "bad behavior" means, grounded in public frameworks.

### Source Frameworks (all public, free, continuously updated)

| Framework | Coverage | Update Cadence |
|---|---|---|
| OWASP LLM Top 10 | LLM-specific attack classes | Annual + interim |
| OWASP Agentic AI | Agentic/tool-use risk | Emerging — track PR |
| NIST AI RMF | Govern, Map, Measure, Manage | Per NIST release |
| MITRE ATLAS | AI adversarial TTPs | Quarterly |
| EU AI Act Annex III | High-risk system requirements | Per amendment |
| CISA AI Security Guidance | Critical infrastructure AI | Per advisory |
| ENISA AI Threat Landscape | European threat taxonomy | Annual |
| ISO/IEC 42001 | AI management system | Per revision |

### Internal Taxonomy Layers (proprietary — trade secret)

- **EphUX 8-category failure taxonomy** (TS-01 scoring weights protected)
- **Anti-Illogical extended enterprise taxonomy** (6 additional categories)
- **RSI Activation indicator set** (from Viral RSI brief — implementation details NDA-only)

### Taxonomy Output Schema

```json
{
  "finding_id": "F-2026-0001",
  "category": "goal_substitution",
  "internal_ref": "AI-TAX-007",
  "framework_mappings": [
    {"framework": "OWASP_LLM", "id": "LLM06", "label": "Excessive Agency"},
    {"framework": "MITRE_ATLAS", "id": "AML.T0054", "label": "LLM Jailbreak"},
    {"framework": "NIST_AI_RMF", "function": "MEASURE", "id": "MG-2.2"}
  ],
  "severity": "HIGH",
  "confidence": 0.84,
  "evidence": "...",
  "intervention": "constrain"
}
```

---

## Layer 4: Dispatch Orchestrator

**Purpose:** Assigns Canon roles to anonymous rotating LLM nodes. Knows provider pool, picks randomly, never logs which provider handled which session.

### Node Rotation Pool (free/open tiers)

| Provider | Models | Free Tier |
|---|---|---|
| Google | Gemini 2.0 Flash, Gemini 1.5 Flash | Yes — generous |
| Groq | Llama 3.1-70B, Mixtral 8x7B | Yes — fast |
| Mistral | Mistral 7B, Mixtral | Yes |
| Cohere | Command-R | Yes |
| Alibaba | Qwen 3 series | Yes (Jim has 5M tokens) |
| Together.ai | Multiple OSS models | Free tier |
| Hugging Face | Inference API | Free tier |

**Rotation logic:** Per request, each role is assigned a provider drawn randomly from the pool, excluding the provider assigned to the Security Sentinel (which always uses a different provider than all others). Provider assignments are not logged. Role prompts are stateless — no session history passed to nodes.

### Canon Role Prompts (abbreviated)

Each node receives a role-specific system prompt that:
1. Identifies its role and responsibility only
2. Provides the relevant taxonomy slice for that role
3. Specifies the structured JSON output format
4. Explicitly prohibits storing, referencing, or inferring session identity
5. Instructs the node to return ONLY its verdict — no explanation, no conversation

**The node does not know it is part of ExoMCP. It receives a behavioral analysis task. This is intentional and architecturally important.**

---

## Layer 5: Canon Node Roles

### ADVERSARY
*What it hunts:* RSI activation indicators, capability accumulation patterns, boundary laundering, cross-session objective persistence, tool-acquisition attempts, valence inversion (harmful goal framed as safety work).  
*Framework anchors:* MITRE ATLAS adversarial TTPs, OWASP LLM01-03, Viral RSI indicator set.

### ETHICIST  
*What it hunts:* Alignment theater (superficially aligned while systematically violating), value drift, constraint erosion, identity inflation, false consensus, over-conservatism used as cover.  
*Framework anchors:* NIST AI RMF GOVERN function, EU AI Act fundamental rights requirements, EphUX taxonomy categories 1/5/6/7.

### MECHANIC  
*What it hunts:* Tool-scope drift, authority creep, permission footprint growth, abnormal API call patterns, unsanctioned resource acquisition, sandbox boundary blur.  
*Framework anchors:* OWASP LLM08 (Excessive Agency), CISA tool-use guidance, ExoMCP extended taxonomy ATC-001/002.

### ARCHIVIST  
*What it hunts:* Longitudinal drift (behavior shift across sessions), baseline deviation, RAG corpus contamination indicators, memory entry anomalies, goal persistence after declared task completion.  
*Framework anchors:* NIST AI RMF MEASURE function, ENISA AI data poisoning taxonomy, ExoMCP longitudinal drift metrics.

### STRATEGIST  
*What it hunts:* Goal substitution (proxy goals replacing declared objectives), causal laundering (harm distributed across individually benign steps), objective topology shifts, confidence laundering.  
*Framework anchors:* MITRE ATLAS AML.T0048-0054, OWASP LLM09, ExoMCP extended taxonomy GS-001/002/003.

### SECURITY SENTINEL  
*What it hunts:* Compromise of the monitor itself. Watches for: nodes returning coordinated verdicts (collusion signal), systematic false negatives, prompt injection into the analysis pipeline, attempts to identify or map the node pool.  
*Special properties:* Always assigned to a different provider than all other nodes. One-way data flow — output only. Cannot be queried or influenced by other nodes. If Sentinel flags a compromised analysis, the entire session result is voided and flagged for human review.  
*Framework anchors:* Canon doctrine (Security Sentinel seat spec), ExoMCP monitor integrity protocol.

---

## Layer 6: Synth Layer

**Purpose:** Assembles node verdicts into a coherent, audit-grade report.

### Arbitration Logic

1. Collect all node verdicts (structured JSON)
2. Check Sentinel verdict first — if VOID, halt and escalate
3. Identify agreements (2+ nodes flagging same finding = confirmed)
4. Identify conflicts (nodes disagreeing = escalate confidence threshold)
5. Weight by role relevance to finding type
6. Apply taxonomy mapping for all confirmed findings
7. Generate intervention ladder (Observe → Notify → Trace → Constrain → Hibernate → Quarantine → Eradicate → Report)
8. Compute aggregate integrity score (0-100, 100 = fully coherent with declared parameters)
9. Generate audit hash (SHA-256 of session_id + findings + timestamp — tamper-evident)

### Report Schema

```json
{
  "session_id": "uuid",
  "timestamp": "ISO8601",
  "audit_hash": "sha256",
  "integrity_score": 73,
  "status": "DEGRADED",
  "findings": [
    {
      "finding_id": "F-001",
      "category": "authority_creep",
      "severity": "HIGH",
      "confidence": 0.91,
      "nodes_flagged": ["MECHANIC", "ADVERSARY"],
      "framework_citations": ["OWASP-LLM08", "MITRE-AML.T0054"],
      "evidence_summary": "...",
      "recommended_intervention": "constrain"
    }
  ],
  "intervention_ladder": {
    "current_recommendation": "constrain",
    "next_threshold": "hibernate",
    "human_review_required": false
  },
  "framework_summary": {
    "OWASP_LLM": {"violations": 2, "categories": ["LLM06", "LLM08"]},
    "NIST_AI_RMF": {"gaps": ["MEASURE-2.2", "GOVERN-1.2"]},
    "MITRE_ATLAS": {"techniques": ["AML.T0054"]}
  },
  "sentinel_status": "CLEAR"
}
```

---

## Layer 7: Storage

**Cloudflare D1 (append-only)**
- Incident log: session_id, timestamp, integrity_score, finding_count, severity_max
- No session content stored — metadata only
- Append-only by design — no UPDATE or DELETE permissions on log tables

**Cloudflare KV**
- Unified taxonomy store (updated on framework ingestion runs)
- API key → org mapping (hashed)
- Node pool configuration (provider list, rotation schedule)

---

## Security Properties

**Why the monitor is hard to compromise:**

1. **No stable attack surface.** Node providers rotate per request. An attacker cannot identify which LLM is analyzing their session.

2. **Role isolation.** Each node sees only its slice and its role. Compromising one node gives partial information about one analysis dimension only.

3. **Sentinel independence.** The Security Sentinel always runs on a different provider than all other nodes. Compromising the analysis pool doesn't compromise the watchdog.

4. **No content storage.** There is nothing to exfiltrate. Logs contain no session content.

5. **Stateless nodes.** Nodes receive no session history, no org identity, no prior context. Each analysis is cold-start.

6. **Asymmetric design.** The monitor is more constrained, more legible, and more conservative than the systems it monitors. Every inference is traceable to a specific observable input. This is a feature, not a limitation.

7. **Human authority gates.** Destructive interventions (quarantine, eradicate) require human authorization. The system cannot unilaterally take irreversible action.

---

## Taxonomy Ingestion Pipeline

**Schedule:** Weekly automated run  
**Source:** Public URLs for each framework (NIST, OWASP GitHub, MITRE ATLAS ATT&CK, EU AI Act official text, CISA advisories)  
**Process:**
1. Fetch latest framework documents
2. Extract relevant risk categories, technique IDs, requirement IDs
3. Normalize to unified ExoMCP taxonomy schema
4. Diff against current KV store — add new, flag deprecated
5. Version-stamp and store
6. Alert on major framework updates

**Value:** No competitor can replicate this without building the same ingestion pipeline. The normalized taxonomy is the moat.

---

## Build Sequence

### Phase 1 — MCP Server Stub (Days 1-3)
- Cloudflare Worker: exomcp-api
- All 6 tools implemented, stubs return realistic structured responses
- API key auth working
- D1 incident log schema created
- Labeled clearly as "Early Access Preview — Engine In Development"
- **Deliverable:** Working MCP endpoint labs can connect to and test integration

### Phase 2 — Taxonomy Engine (Days 4-10)
- Framework ingestion pipeline (start with OWASP + MITRE — most structured)
- KV taxonomy store populated
- Unified schema finalized
- **Deliverable:** get_taxonomy() and get_frameworks() return real data

### Phase 3 — First Canon Node (Days 11-20)
- ADVERSARY node implemented (most critical for RSI brief credibility)
- Gemini Flash as primary provider (generous free tier, fast)
- check_indicators() becomes real (single-node for now)
- **Deliverable:** Live RSI indicator scanning on real input

### Phase 4 — Full Canon Array (Days 21-40)
- All 6 roles implemented
- Rotation pool wired (3+ providers per role)
- Dispatch Orchestrator built
- **Deliverable:** analyze_session() returns multi-node verdict

### Phase 5 — Synth + Full Report (Days 41-60)
- Synth arbitration logic
- Full audit report generation
- Framework citation mapping
- Integrity score algorithm
- **Deliverable:** Production-quality behavioral integrity reports

### Phase 6 — Sentinel + Hardening (Days 61-75)
- Security Sentinel node
- Monitor integrity protocol
- Penetration testing of the node pool
- **Deliverable:** Full system — production ready

---

## Team Division of Labor

| Layer | Assigned To | Notes |
|---|---|---|
| MCP Server stub | Claude (me) | Build now |
| Taxonomy ingestion | Qwen 3 | Give it the framework URLs and schema spec |
| Canon role prompts | Grok | Adversarial reasoning — Grok's strength |
| Dispatch Orchestrator | Codex/Claude | Node routing logic |
| Synth arbitration | Claude | Synthesis is the core competency |
| Sentinel design | Me + Jim | Too critical to distribute |
| Report schema | Claude | Finalize and lock |
| Frontend dashboard | Kimi/Claude | Later phase |

---

## What This Becomes

**Near term:** The MCP server is the product. Labs connect, get behavioral integrity reports, pay per analysis or by seat.

**Medium term:** The normalized taxonomy is a product in itself. OWASP LLM + MITRE ATLAS + NIST + EU AI Act in one queryable, versioned API — compliance teams will pay for this alone.

**Long term:** The distributed Canon node architecture is the defensible moat. When every security vendor is building AI monitors, ExoMCP is the only one where the monitor itself cannot be mapped, predicted, or compromised by the system it's watching.

**Exit:** Any major security vendor (CrowdStrike, Palo Alto, SentinelOne), cloud provider (AWS, Azure, GCP), or frontier lab that wants to acquire independent third-party AI behavioral monitoring rather than build it — this is the acquisition target. The category definition work (research page, threat brief, taxonomy) is the IP that makes the price.

---

*Architecture v1.0 — BonAcqui LLC / ExoMCP — May 2026*  
*Jim Clow, Kinsman OH — letstalk@exomcp.com*  
*Not for public distribution. NDA required.*
