const Joi = require('joi');

exports.validateRegistration = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .trim(),
        email: Joi.string()
            .email()
            .required()
            .trim()
            .lowercase(),
        password: Joi.string()
            .min(6)
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .messages({
                'string.pattern.base': 'Password must be alphanumeric and between 6-30 characters'
            })
    });

    return schema.validate(data);
};

exports.validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .trim()
            .lowercase(),
        password: Joi.string()
            .required()
    });

    return schema.validate(data);
};


exports.validateProduct = (product) => {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(10),
        price: Joi.number().required().min(0),
        category: Joi.string().required(),
        stock: Joi.number().integer().min(0).default(0),
        images: Joi.array().items(Joi.string()),
        ratings: Joi.array().items(
            Joi.object({
                user: Joi.string().required(),
                rating: Joi.number().required().min(1).max(5),
                review: Joi.string()
            })
        )
    });

    return schema.validate(product);
};

exports.validatePayment = (req, res, next) => {
    const { orderId } = req.body;
    
    if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
    }
    
    next();
};

exports.validateOrder = (req, res, next) => {
    const schema = Joi.object({
        shippingAddress: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            zipCode: Joi.string().required()
        }).required(),
        paymentMethod: Joi.string()
            .valid('CARD', 'CASH', 'WALLET')
            .required()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};