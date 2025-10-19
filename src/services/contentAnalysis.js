// src/services/geminiAnalysisService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeTextWithGemini = async (text) => {
    const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-pro",
        generationConfig: { responseMimeType: "application/json" },
    });
    const prompt = `
    Analyze the following text and provide a response in a clean JSON format.
    Do not include any markdown formatting like \`\`\`json.
    The JSON object should have the following structure:
    {
      "sentiment": {"label": "positive|negative|neutral", "score": <float between -1 and 1>},
      "keywords": ["<keyword1>", "<keyword2>"],
      "summary": "<a one-sentence summary>"
    }

    Text to analyze: "${text}"
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonResponse = JSON.parse(response.text());
        return {
            analysis: jsonResponse,
            usage: { model: "models/gemini-2.5-pro" },
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze text with the AI model.");
    }
};

module.exports = { analyzeTextWithGemini };