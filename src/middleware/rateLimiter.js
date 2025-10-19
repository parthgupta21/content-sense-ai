const redisClient = require('../config/redisclient');

const WINDOW_SIZE_IN_HOURS = 1;
const MAX_WINDOW_REQUEST_COUNT = 3; // Allow 20 requests per hour
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

const rateLimiter = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        let records = await redisClient.get(apiKey);
        const currentRequestTime = new Date().getTime();

        if (records == null) {
            let newRecord = [];
            let requestLog = {
                requestTimeStamp: currentRequestTime,
                requestCount: 1
            };
            newRecord.push(requestLog);
            await redisClient.set(apiKey, JSON.stringify(newRecord));
            return next();
        }

        let data = JSON.parse(records);

        let windowStartTimestamp = new Date().getTime();
        let requestsWithinWindow = data.filter((entry) => {
            return entry.requestTimeStamp > windowStartTimestamp - WINDOW_SIZE_IN_HOURS * 60 * 60 * 1000;
        });
        let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.requestCount;
        }, 0);

        if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
            return res.status(429).json({
                error: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hour limit!`
            });
        }
        let lastRequestLog = data[data.length - 1];
        let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime - WINDOW_LOG_INTERVAL_IN_HOURS * 60 * 60 * 1000;
        if (lastRequestLog.requestTimeStamp < potentialCurrentWindowIntervalStartTimeStamp) {
            let newRecord = [...data];
            let requestLog = {
                requestTimeStamp: currentRequestTime,
                requestCount: 1,
            };
            newRecord.push(requestLog);
            await redisClient.set(apiKey, JSON.stringify(newRecord));
            return next();
        }
        lastRequestLog.requestCount++;
        data[data.length - 1] = lastRequestLog;
        await redisClient.set(apiKey, JSON.stringify(data));
        return next();
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

module.exports = { rateLimiter };