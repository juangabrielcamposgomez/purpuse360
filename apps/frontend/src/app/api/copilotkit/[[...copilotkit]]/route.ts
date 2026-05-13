import {
  CopilotRuntime,
  CopilotKitIntelligence,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

const isProduction = process.env.NODE_ENV === 'production';

function missing(v: string): boolean {
  return !process.env[v];
}

const missingVars: string[] = [];
if (missing("LANGGRAPH_DEPLOYMENT_URL")) missingVars.push("LANGGRAPH_DEPLOYMENT_URL");
if (missing("NEXT_PUBLIC_COPILOTKIT_LICENSE_TOKEN") && missing("COPILOTKIT_LICENSE_TOKEN")) missingVars.push("NEXT_PUBLIC_COPILOTKIT_LICENSE_TOKEN");

console.log(`[CopilotKit] Production=${isProduction}`);
if (missingVars.length) {
  console.log(`[CopilotKit] WARNING: Missing env vars: ${missingVars.join(", ")}`);
}

const runtimeConfig: any = {
  identifyUser: () => ({
    id: "default",
    name: "Purpose360 AI Professional",
    role: "Medical Expert"
  }),
  licenseToken: process.env.COPILOTKIT_LICENSE_TOKEN || process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_TOKEN,
  openGenerativeUI: true,
};

const intelligenceApiKey = process.env.INTELLIGENCE_API_KEY;
if (intelligenceApiKey) {
  runtimeConfig.intelligence = new CopilotKitIntelligence({
    apiKey: intelligenceApiKey,
    apiUrl: process.env.INTELLIGENCE_API_URL || (isProduction ? "https://api.cloud.copilotkit.ai/v1" : "http://localhost:4203"),
    wsUrl: process.env.INTELLIGENCE_GATEWAY_WS_URL || (isProduction ? "wss://api.cloud.copilotkit.ai/v1" : "ws://localhost:4403"),
  });
  console.log(`[CopilotKit] Intelligence enabled (cloud=${isProduction})`);
} else {
  console.log(`[CopilotKit] Intelligence disabled — set INTELLIGENCE_API_KEY for thread persistence`);
}

const langgraphUrl = process.env.LANGGRAPH_DEPLOYMENT_URL || "";
const validatedUrl = langgraphUrl.startsWith("http")
  ? langgraphUrl
  : langgraphUrl
    ? `https://${langgraphUrl}`
    : "";

if (validatedUrl) {
  runtimeConfig.agents = {
    default: new LangGraphAgent({
      deploymentUrl: validatedUrl,
      graphId: "default",
      langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
      assistantConfig: {
        recursion_limit: Number(process.env.LANGGRAPH_RECURSION_LIMIT ?? 60),
      },
    }),
  };
  console.log(`[CopilotKit] Agent configured: ${validatedUrl}`);
} else {
  console.log(`[CopilotKit] WARNING: No LangGraph agent — set LANGGRAPH_DEPLOYMENT_URL`);
}

const runtime = new CopilotRuntime(runtimeConfig);

const baseHandler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

const handler = async (req: Request) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[CopilotKit][${requestId}] ${req.method} /api/copilotkit`);

  try {
    const res = await baseHandler(req);
    if (!res.ok) {
      const text = await res.clone().text();
      console.error(`[CopilotKit][${requestId}] HTTP ${res.status}: ${text.slice(0, 500)}`);
    }
    return res;
  } catch (error: any) {
    console.error(`[CopilotKit][${requestId}] Error:`, error?.message || error);
    return new Response(
      JSON.stringify({
        error: "CopilotKit Runtime Error",
        message: error?.message || "Unknown error",
        requestId,
        hint: isProduction
          ? "Set INTELLIGENCE_API_KEY, LANGGRAPH_DEPLOYMENT_URL, and GEMINI_API_KEY in Vercel env vars."
          : "Ensure the LangGraph agent is running locally (npm run dev:agent)."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const GET = handler;
export const POST = handler;
