import { auth } from "@clerk/nextjs/server";
import { HfInference } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req: NextRequest) {
  let prompt: string | undefined;
  
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    prompt = body.prompt;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Use a text generation model to enhance the prompt
    const systemPrompt = "You are an AI assistant specialized in creating detailed, descriptive prompts for image generation. Rewrite the user's short prompt into a comprehensive, detailed description that will help generate high-quality images. Include details about composition, lighting, style, mood, and technical qualities. Return only the enhanced prompt, nothing else.";

    const enhancedPrompt = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: `<s>[INST] ${systemPrompt}\n\nUser prompt: ${prompt.trim()} [/INST]`,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false,
      },
    });

    // Extract the generated text (clean up any extra formatting)
    let generatedText = enhancedPrompt.generated_text?.trim() || "";
    
    // Clean up the response - remove any remaining tags or formatting
    generatedText = generatedText
      .replace(/\[INST\].*?\[\/INST\]/gi, "")
      .replace(/<s>|<\/s>/g, "")
      .trim();

    // If the model didn't generate text, fall back to a simple enhancement
    if (!generatedText) {
      generatedText = `${prompt.trim()}, highly detailed, professional quality, 8k resolution, masterpiece`;
    }

    return NextResponse.json({ enhancedPrompt: generatedText });
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    
    // Fallback enhancement if API fails - use stored prompt
    if (prompt && typeof prompt === "string" && prompt.trim()) {
      const fallback = `${prompt.trim()}, highly detailed, professional quality, 8k resolution, masterpiece, cinematic lighting`;
      return NextResponse.json({ enhancedPrompt: fallback });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to enhance prompt",
      },
      { status: 500 }
    );
  }
}
