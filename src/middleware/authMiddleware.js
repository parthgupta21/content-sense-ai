require('dotenv').config();

const authenticationKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.AUTH_KEY) {
        return res.status(401).json({
            error: "Unauthorized access. Invalid API key."
        })
    }
    next();
}

module.exports = {
    authenticationKey,
}