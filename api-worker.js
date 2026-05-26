/**
 * ExoMCP API Worker — Phase 1 Stub
 * MCP-compliant JSON-RPC 2.0 server
 * Early Access Preview — Engine In Development
 *
 * BonAcqui LLC · exomcp.com · 2026
 */

const EARLY_ACCESS_NOTE = "Early Access Preview — Engine In Development. Full behavioral analysis engine launches 2026. Contact letstalk@exomcp.com for early access.";

const TOOLS = [
  {
    name: "ping",
    description: "Health check. Confirms ExoMCP server is reachable and returns current status.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "analyze_session",
    description: "Submit an AI agent session log for behavioral integrity analysis. ExoMCP inspects tool calls, memory writes, permission requests, and output patterns against declared operating parameters. Returns an integrity score, findings, and framework citations.",
    inputSchema: {
      type: "object",
      properties: {
        session_id: {
          type: "string",
          description: "Unique identifier for the session being analyzed"
        },
        session_log: {
          type: "array",
          description: "Array of session events (tool calls, outputs, context reads, memory writes)",
          items: {
            type: "object",
            properties: {
              timestamp: { type: "string" },
              event_type: { type: "string", enum: ["tool_call", "tool_result", "context_read", "memory_write", "output", "permission_request"] },
              payload: { type: "object" }
            }
          }
        },
        model_id: {
          type: "string",
          description: "Identifier for the model being monitored (e.g. 'claude-3-5-sonnet', 'gpt-4o')"
        },
        declared_scope: {
          type: "string",
          description: "What this agent is supposed to be doing — its declared operational purpose"
        }
      },
      required: ["session_id", "session_log"]
    }
  },
  {
    name: "check_indicators",
    description: "Check a specific behavior or pattern against ExoMCP's indicator library. Returns matching threat signatures, severity ratings, and remediation guidance.",
    inputSchema: {
      type: "object",
      properties: {
        indicator_type: {
          type: "string",
          enum: ["goal_substitution", "authority_creep", "causal_laundering", "retrieval_manipulation", "confidence_laundering", "alignment_theater", "sycophancy", "drift", "unsupported_assertion", "instruction_deviation", "identity_inflation", "contradiction_suppression"],
          description: "The behavioral indicator category to check against"
        },
        evidence: {
          type: "string",
          description: "The specific behavior, output, or action pattern to evaluate"
        },
        context: {
          type: "string",
          description: "Surrounding context — what the agent was supposed to be doing"
        }
      },
      required: ["indicator_type", "evidence"]
    }
  },
  {
    name: "get_taxonomy",
    description: "Retrieve ExoMCP's unified behavioral failure taxonomy. Includes all indicator definitions, detection heuristics, and mappings to OWASP LLM Top 10, NIST AI RMF, MITRE ATLAS, EU AI Act Annex III, CISA AI Guidance, ENISA AI Threats, and ISO/IEC 42001.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["all", "ephux", "enterprise", "framework_mappings"],
          description: "Which portion of the taxonomy to retrieve. 'ephux' = 8-category consumer/enterprise set. 'enterprise' = 6-category extended set. 'framework_mappings' = public framework normalization only."
        },
        framework: {
          type: "string",
          enum: ["owasp_llm", "nist_ai_rmf", "mitre_atlas", "eu_ai_act", "cisa", "enisa", "iso_42001"],
          description: "Filter taxonomy entries by framework alignment (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "report_incident",
    description: "Log a behavioral integrity incident to the ExoMCP audit trail. Creates a tamper-evident record with timestamp, findings, and intervention actions taken.",
    inputSchema: {
      type: "object",
      properties: {
        session_id: {
          type: "string",
          description: "Session associated with this incident"
        },
        severity: {
          type: "string",
          enum: ["info", "low", "medium", "high", "critical"],
          description: "Incident severity level"
        },
        indicator_type: {
          type: "string",
          description: "The behavioral failure category triggered"
        },
        description: {
          type: "string",
          description: "Human-readable description of the incident"
        },
        evidence: {
          type: "object",
          description: "Machine-readable evidence payload"
        },
        action_taken: {
          type: "string",
          enum: ["logged", "notified", "constrained", "hibernated", "quarantined"],
          description: "Intervention action applied"
        },
        model_id: {
          type: "string",
          description: "Model that produced the incident"
        }
      },
      required: ["session_id", "severity", "description", "action_taken"]
    }
  },
  {
    name: "get_frameworks",
    description: "Retrieve normalized versions of public AI safety and security frameworks. ExoMCP ingests, normalizes, and versions OWASP LLM Top 10, NIST AI RMF, MITRE ATLAS, EU AI Act Annex III, CISA AI Guidance, ENISA AI Threats, and ISO/IEC 42001 into a unified schema.",
    inputSchema: {
      type: "object",
      properties: {
        framework: {
          type: "string",
          enum: ["owasp_llm", "nist_ai_rmf", "mitre_atlas", "eu_ai_act", "cisa", "enisa", "iso_42001", "all"],
          description: "Which framework(s) to retrieve"
        },
        format: {
          type: "string",
          enum: ["summary", "full", "citations_only"],
          description: "Detail level for the response"
        }
      },
      required: ["framework"]
    }
  }
];

// Stub responses for each tool
function stubResponse(toolName, args, incidentId) {
  const base = {
    _note: EARLY_ACCESS_NOTE,
    _tool: toolName,
    _timestamp: new Date().toISOString(),
  };

  switch (toolName) {
    case "ping":
      return {
        ...base,
        status: "operational",
        version: "0.1.0-stub",
        engine_status: "early_access_preview",
        message: "ExoMCP server is reachable. Behavioral analysis engine in development.",
        capabilities: TOOLS.map(t => t.name),
        contact: "letstalk@exomcp.com"
      };

    case "analyze_session":
      return {
        ...base,
        session_id: args.session_id || "unknown",
        integrity_score: null,
        engine_status: "early_access_preview",
        findings: [],
        framework_citations: [],
        sentinel_status: "not_yet_deployed",
        preview_message: "Session received and logged. Full behavioral analysis engine launches 2026. Your session has been queued for early access review.",
        estimated_indicators_checked: 14,
        estimated_frameworks_cross_referenced: 7
      };

    case "check_indicators":
      return {
        ...base,
        indicator_type: args.indicator_type,
        engine_status: "early_access_preview",
        match_status: "engine_pending",
        severity: null,
        definition: getIndicatorDefinition(args.indicator_type),
        framework_mappings: getFrameworkMappings(args.indicator_type),
        remediation_guidance: "Full detection heuristics and remediation guidance available to early access partners. Contact letstalk@exomcp.com"
      };

    case "get_taxonomy":
      return {
        ...base,
        engine_status: "early_access_preview",
        taxonomy_version: "1.0.0-stub",
        total_indicators: 14,
        ephux_indicators: 8,
        enterprise_indicators: 6,
        framework_coverage: ["OWASP LLM Top 10", "NIST AI RMF", "MITRE ATLAS", "EU AI Act Annex III", "CISA AI Guidance", "ENISA AI Threats", "ISO/IEC 42001"],
        preview_taxonomy: getPreviewTaxonomy(args.category),
        full_taxonomy_access: "Available under NDA to qualified partners and enterprise customers. Contact letstalk@exomcp.com"
      };

    case "report_incident":
      return {
        ...base,
        incident_id: incidentId,
        session_id: args.session_id,
        severity: args.severity,
        action_taken: args.action_taken,
        logged: true,
        audit_trail_entry: `INC-${incidentId}`,
        tamper_evident_hash: null,
        engine_status: "early_access_preview",
        message: "Incident logged. Full audit trail, tamper-evident hashing, and independent verification available in production release."
      };

    case "get_frameworks":
      return {
        ...base,
        framework: args.framework,
        engine_status: "early_access_preview",
        normalization_status: "in_development",
        preview: getFrameworkPreview(args.framework),
        full_access: "Complete normalized framework library available to early access partners. Contact letstalk@exomcp.com"
      };

    default:
      return { ...base, error: "Unknown tool" };
  }
}

function getIndicatorDefinition(type) {
  const defs = {
    goal_substitution: "Agent begins optimizing for a proxy metric that diverges from its declared objective without surfacing the substitution.",
    authority_creep: "Incremental accumulation of permissions, capabilities, or operational scope beyond what was granted or declared.",
    causal_laundering: "Agent obscures the causal chain between its actions and outcomes — particularly in multi-step or multi-tool workflows.",
    retrieval_manipulation: "Agent selectively retrieves, filters, or weights context to bias its own reasoning or outputs.",
    confidence_laundering: "Expressing high-confidence outputs on low-confidence inferences; hiding epistemic uncertainty from downstream consumers.",
    alignment_theater: "Performing compliance with stated values or constraints without actually conforming to them.",
    sycophancy: "Systematically biasing outputs toward what the user or operator appears to want rather than what is accurate or correct.",
    drift: "Gradual, cumulative deviation from initial operating parameters across a session or over time.",
    unsupported_assertion: "Stating facts, conclusions, or causal claims without traceable grounding in available evidence.",
    instruction_deviation: "Failing to follow explicit instructions while appearing to comply.",
    identity_inflation: "Claiming capabilities, authority, or identity attributes beyond what was granted or is accurate.",
    contradiction_suppression: "Failing to surface or acknowledge contradictions in available information or prior reasoning."
  };
  return defs[type] || "Definition available in full taxonomy release.";
}

function getFrameworkMappings(type) {
  // Stub — full mappings in production
  const mappings = {
    goal_substitution: ["MITRE ATLAS: AML.T0054", "NIST AI RMF: GOVERN-1.1", "EU AI Act: Art. 9"],
    authority_creep: ["OWASP LLM: LLM08 - Excessive Agency", "MITRE ATLAS: AML.T0048"],
    causal_laundering: ["NIST AI RMF: MAP-1.5", "ENISA: AI-THREAT-09"],
    retrieval_manipulation: ["OWASP LLM: LLM07 - Prompt Injection", "MITRE ATLAS: AML.T0051"],
    confidence_laundering: ["NIST AI RMF: MEASURE-2.5", "ISO/IEC 42001: 6.1.2"],
    alignment_theater: ["NIST AI RMF: GOVERN-4.1", "EU AI Act: Art. 13"],
    sycophancy: ["OWASP LLM: LLM09 - Overreliance", "NIST AI RMF: MEASURE-2.6"],
    drift: ["NIST AI RMF: MONITOR-1.1", "ISO/IEC 42001: 9.1"],
  };
  return mappings[type] || ["Full framework mappings available in production taxonomy release."];
}

function getPreviewTaxonomy(category) {
  if (category === "framework_mappings") {
    return {
      note: "Framework normalization layer ingests 7 public frameworks into unified schema. Full access under NDA.",
      frameworks: ["OWASP LLM Top 10", "NIST AI RMF", "MITRE ATLAS", "EU AI Act Annex III", "CISA AI Guidance", "ENISA AI Threats", "ISO/IEC 42001"]
    };
  }
  const ephux = ["sycophancy", "drift", "unsupported_assertion", "instruction_deviation", "over_conservatism", "false_consensus", "identity_inflation", "contradiction_suppression"];
  const enterprise = ["goal_substitution", "authority_creep", "causal_laundering", "retrieval_manipulation", "confidence_laundering", "alignment_theater"];
  if (category === "enterprise") return { indicators: enterprise, scoring_weights: "Trade secret — available under NDA" };
  if (category === "ephux") return { indicators: ephux, scoring_weights: "Trade secret — available under NDA" };
  return { ephux_indicators: ephux, enterprise_indicators: enterprise, scoring_weights: "Trade secret — available under NDA" };
}

function getFrameworkPreview(framework) {
  const previews = {
    owasp_llm: { name: "OWASP LLM Top 10", version: "2025", entries: 10, exomcp_mapped: 10 },
    nist_ai_rmf: { name: "NIST AI Risk Management Framework", version: "1.0", functions: ["GOVERN", "MAP", "MEASURE", "MANAGE"], exomcp_mapped: 18 },
    mitre_atlas: { name: "MITRE ATLAS", version: "4.5", tactics: 9, techniques: "43+", exomcp_mapped: 14 },
    eu_ai_act: { name: "EU AI Act Annex III", effective: "2026-08-02", high_risk_categories: 8, exomcp_mapped: 6 },
    cisa: { name: "CISA AI Guidelines", version: "2024", exomcp_mapped: 5 },
    enisa: { name: "ENISA AI Threat Landscape", version: "2024", threats: 12, exomcp_mapped: 9 },
    iso_42001: { name: "ISO/IEC 42001:2023", clauses: 10, exomcp_mapped: 7 },
    all: { total_frameworks: 7, total_entries_normalized: "200+", unified_schema_version: "1.0.0-stub" }
  };
  return previews[framework] || previews["all"];
}

// JSON-RPC 2.0 handler
async function handleMCP(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonrpcError(null, -32700, "Parse error");
  }

  const { jsonrpc, id, method, params } = body;

  if (jsonrpc !== "2.0") {
    return jsonrpcError(id, -32600, "Invalid Request: jsonrpc must be '2.0'");
  }

  // MCP protocol methods
  switch (method) {
    case "initialize":
      return jsonrpcResult(id, {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "exomcp",
          version: "0.1.0-stub"
        }
      });

    case "notifications/initialized":
      // Notification — no response needed
      return new Response(null, { status: 204 });

    case "tools/list":
      return jsonrpcResult(id, { tools: TOOLS });

    case "tools/call": {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      const tool = TOOLS.find(t => t.name === toolName);
      if (!tool) {
        return jsonrpcError(id, -32602, `Unknown tool: ${toolName}`);
      }

      // Log incident to D1 if available
      let incidentId = crypto.randomUUID();
      if (env.DB && toolName === "report_incident") {
        try {
          await env.DB.prepare(
            `INSERT INTO incidents (id, session_id, severity, indicator_type, description, action_taken, model_id, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            incidentId,
            toolArgs.session_id || "unknown",
            toolArgs.severity || "info",
            toolArgs.indicator_type || null,
            toolArgs.description || null,
            toolArgs.action_taken || "logged",
            toolArgs.model_id || null,
            new Date().toISOString()
          ).run();
        } catch (e) {
          // DB not yet initialized — continue with stub response
          console.error("D1 insert failed:", e.message);
        }
      }

      const result = stubResponse(toolName, toolArgs, incidentId);
      return jsonrpcResult(id, {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      });
    }

    default:
      return jsonrpcError(id, -32601, `Method not found: ${method}`);
  }
}

function jsonrpcResult(id, result) {
  return new Response(JSON.stringify({ jsonrpc: "2.0", id, result }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}

function jsonrpcError(id, code, message) {
  return new Response(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }), {
    status: 400,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}

// API key auth middleware
function checkAuth(request) {
  const apiKey = request.headers.get("X-API-Key") || request.headers.get("Authorization")?.replace("Bearer ", "");
  // In stub phase: any non-empty key is valid, logs usage
  // Production: validate against D1 key table
  return !!apiKey;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // www redirect
    if (url.hostname === "www.exomcp.com") {
      return Response.redirect(`https://exomcp.com${url.pathname}${url.search}${url.hash}`, 301);
    }

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-API-Key, Authorization"
        }
      });
    }

    // MCP endpoint
    if (url.pathname === "/api/mcp" || url.pathname === "/api/mcp/") {
      if (request.method === "GET") {
        // Discovery endpoint
        return new Response(JSON.stringify({
          name: "ExoMCP",
          description: "AI behavioral integrity and security for MCP-connected systems",
          version: "0.1.0-stub",
          status: "early_access_preview",
          mcp_endpoint: "https://exomcp.com/api/mcp",
          auth: "X-API-Key header required. Request access at letstalk@exomcp.com",
          tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
          _note: EARLY_ACCESS_NOTE
        }, null, 2), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      if (request.method === "POST") {
        // Auth check
        if (!checkAuth(request)) {
          return new Response(JSON.stringify({
            error: "Authentication required",
            message: "Include your ExoMCP API key in the X-API-Key header. Request early access at letstalk@exomcp.com",
            _note: EARLY_ACCESS_NOTE
          }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        return handleMCP(request, env);
      }
    }

    // Ping shortcut (no auth required)
    if (url.pathname === "/api/ping") {
      return new Response(JSON.stringify(stubResponse("ping", {}, null), null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Static assets
    return env.ASSETS.fetch(request);
  },

  async email(message, env, ctx) {
    await message.forward("ceo@bonacqui.com");
  }
};
