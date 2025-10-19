const Joi = require('joi');

const validateRequest = (req, res, next) => {
    const schema = Joi.object({
        body: Joi.object({
            text: Joi.string()
                .min(10)
                .max(5000)
                .required()
                .messages({
                    'string.base': `"text" should be a type of 'text'`,
                    'string.empty': `"text" cannot be an empty field`,
                    'string.min': `"text" should have a minimum length of {#limit}`,
                    'string.max': `"text" should have a maximum length of {#limit}`,
                    'any.required': `"text" is a required field`
                }),
        }),

        headers: Joi.object({
            'x-api-key': Joi.string()
                .required()
                .messages({
                    'any.required': `"Auth key" is missing.`
                })
        }).unknown(true)
    });

    const { error } = schema.validate({ body: req.body, headers: req.headers });
    if (error) {
        return res.status(400).json({
            message: 'Invalid Request Data', details: error.details.map(d => d.message)
        });
    }

    next();
};

module.exports = {
    validateRequest,
}