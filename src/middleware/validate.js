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
