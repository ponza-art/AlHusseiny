const Joi = require('joi');

exports.validateAdminAction = (req, res, next) => {
    const schema = Joi.object({
        role: Joi.string().valid('user', 'admin').required()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

exports.validateDateRange = (req, res, next) => {
    const schema = Joi.object({
        startDate: Joi.date().required(),
        endDate: Joi.date().min(Joi.ref('startDate')).required()
    });
    
    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}; 