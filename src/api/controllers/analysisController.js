const contentAnalysis = require('../../services/contentAnalysis');

const analyzeContent = async (req, res) => {

    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required for analysis." });
    }

    const analysisResult = await contentAnalysis.analyzeTextWithGemini(text);
    res.status(200).json(analysisResult);
}

module.exports = { analyzeContent };