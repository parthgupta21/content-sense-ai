const redisClient = require('../config/redisClient');

const WINDOW_SIZE_IN_SECONDS = 3600; // 1 hour
const MAX_REQUEST_COUNT = 3;

const rateLimiter = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        const currentTime = new Date().getTime(); // Milliseconds
        const windowStart = currentTime - (WINDOW_SIZE_IN_SECONDS * 1000);

        const multi = redisClient.multi();

        multi.zRemRangeByScore(apiKey, 0, windowStart);
        multi.zAdd(apiKey, { score: currentTime, value: `${currentTime}` });
        multi.zCount(apiKey, windowStart, currentTime);
        multi.expire(apiKey, WINDOW_SIZE_IN_SECONDS + 1);

        const results = await multi.exec();

        const requestCount = results[2];

        if (requestCount > MAX_REQUEST_COUNT) {
            return res.status(429).json({
                error: `You have exceeded the ${MAX_REQUEST_COUNT} requests in 1 hour limit!`
            });
        }

        return next();
    } catch (error) {
        console.error("Rate limiter error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { rateLimiter };