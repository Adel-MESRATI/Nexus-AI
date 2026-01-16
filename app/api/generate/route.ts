import { auth } from "@clerk/nextjs/server";
import { HfInference } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

const hf = new HfInference(process.env.HF_TOKEN);

const ASPECT_RATIO_MAP: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "2:3": { width: 832, height: 1216 },
  "3:2": { width: 1216, height: 832 },
  "16:9": { width: 1344, height: 768 },
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, aspectRatio, negativePrompt, style } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Style keywords mapping
    const STYLE_KEYWORDS: Record<string, string> = {
      none: "",
      cinematic: "cinematic lighting, 8k, hyper-realistic, shot on IMAX, dramatic",
      "3d": "Unreal Engine 5 render, 3D, octane render, ray tracing",
      anime: "anime style, studio ghibli, vibrant, detailed line art",
      cyberpunk: "neon lights, cyberpunk, futuristic, blade runner style",
      pixel: "pixel art, 8-bit, retro game style, low poly, vibrant colors",
      claymation: "claymation, stop motion, plasticine, Aardman style",
    };

    // Combine user prompt with style keywords
    const styleKeywords = style && STYLE_KEYWORDS[style] ? STYLE_KEYWORDS[style] : "";
    const enhancedPrompt = styleKeywords 
      ? `${prompt}, ${styleKeywords}` 
      : prompt;

    const dimensions = ASPECT_RATIO_MAP[aspectRatio] || ASPECT_RATIO_MAP["1:1"];

    const parameters: {
      width: number;
      height: number;
      negative_prompt?: string;
    } = {
      width: dimensions.width,
      height: dimensions.height,
    };

    if (negativePrompt && typeof negativePrompt === "string" && negativePrompt.trim()) {
      parameters.negative_prompt = negativePrompt.trim();
    }

    const imageBlob = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: enhancedPrompt,
      parameters,
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    return NextResponse.json({ image: base64 });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate image",
      },
      { status: 500 }
    );
  }
}
