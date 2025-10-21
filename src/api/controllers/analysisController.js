const contentAnalysis = require('../../services/contentAnalysis');

const analyzeContent = async (req, res) => {

    const { text } = req.body;
    const analysisResult = await contentAnalysis.analyzeTextWithGemini(text);
    res.status(200).json(analysisResult);
}

module.exports = { analyzeContent };