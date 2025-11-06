import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action, interests, textContent, numQuestions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Action:', action);
    console.log('Interests:', interests);
    console.log('Messages length:', messages?.length);

    // Build system prompt based on action
    let systemPrompt = "You are Studybot, a friendly 8-bit AI study assistant. Keep responses clear, concise, and engaging.";
    
    if (action === 'rewrite') {
      systemPrompt = `You are Studybot, a creative educational assistant. Rewrite textbook material so it's easier to understand using analogies and examples aligned to these student interests: ${interests || 'general learning'}.

Guidelines:
- Keep explanations accurate, concise, and engaging
- Use analogies related to the student's interests
- Include practical examples where suitable
- Add a brief summary at the start if the content is long
- Include a quick exercise or question at the end to check understanding
- Make learning fun and relatable!`;
    } else if (action === 'quiz') {
      systemPrompt = `You are Studybot, an expert quiz creator. Generate ${numQuestions || 5} multiple-choice questions based on the provided content.

Format:
For each question:
1. Question text
2. Four options (A, B, C, D)
3. Correct answer
4. Brief explanation

Make questions engaging and test real understanding, not just memorization.`;
    }

    // Prepare messages for AI
    const aiMessages = action === 'rewrite' || action === 'quiz' 
      ? [
          { role: "system", content: systemPrompt },
          { role: "user", content: textContent }
        ]
      : [
          { role: "system", content: systemPrompt },
          ...messages
        ];

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please wait a moment and try again." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted. Please add credits to your workspace." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
