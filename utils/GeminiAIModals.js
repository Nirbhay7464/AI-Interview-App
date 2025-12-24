// utils/GeminiAIModals.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const model = "gemini-flash-latest";

export async function generateInterviewQuestions(inputPrompt) {
  try {
    const result = await ai.models.generateContent({
      model,
      contents: inputPrompt,
    });

    let outputText = "";

    // Extract text safely from Gemini output
    if (
      result &&
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content?.parts?.length > 0
    ) {
      outputText = result.candidates[0].content.parts[0].text || "";
    } else {
      console.error("Unexpected response structure:", result);
      throw new Error("Invalid response structure from Gemini API");
    }

    // Clean out markdown fences
    outputText = outputText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Parse JSON safely
    let parsedData = [];
    try {
      const jsonData = JSON.parse(outputText);

      if (Array.isArray(jsonData)) {
        parsedData = jsonData.map((item) => ({
          question: item.question || item.Question || "",
          answer: item.answer || item.Answer || "",
        }));
      } else {
        parsedData = [{ question: "Invalid format", answer: outputText }];
      }
    } catch (err) {
      console.warn("⚠️ Failed to parse as JSON, returning raw text");
      parsedData = [{ question: "Raw Output", answer: outputText }];
    }

    return parsedData; // ⬅️ Always returns array
  } catch (error) {
    console.error("❌ Error generating content:", error);
    throw error;
  }
}
