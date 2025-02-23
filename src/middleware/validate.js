const validate = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    message: "Validation error",
                    details: error.details,
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
const userValidation = {
    register: {
        address: {
            type: String,
            required: true,
            length: 66, // Starknet address length
        },
        username: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
        },
    },
};
module.exports = { validate, userValidation };
