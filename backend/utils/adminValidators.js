const Joi = require('joi');

exports.validateUserRoleUpdate = (data) => {
    const schema = Joi.object({
        role: Joi.string().valid('user', 'admin').required()
    });
    return schema.validate(data);
};

exports.validateOrderStatusUpdate = (data) => {
    const schema = Joi.object({
        orderStatus: Joi.string()
            .valid('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')
            .required()
    });
    return schema.validate(data);
};

exports.validateDateRange = (data) => {
    const schema = Joi.object({
        startDate: Joi.date().required(),
        endDate: Joi.date().min(Joi.ref('startDate')).required()
    });
    return schema.validate(data);
}; 