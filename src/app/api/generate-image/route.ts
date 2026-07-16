import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.HUGGINGFACE_API_KEY) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  try {
    const hfRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt.trim() }),
      }
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text().catch(() => "");
      throw new Error(errText || `HuggingFace error ${hfRes.status}`);
    }

    // HuggingFace returns raw image binary
    const imageBuffer = Buffer.from(await hfRes.arrayBuffer());
    const contentType = hfRes.headers.get("content-type") ?? "image/jpeg";
    const dataUri = `data:${contentType};base64,${imageBuffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "elnatal-portfolio",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
