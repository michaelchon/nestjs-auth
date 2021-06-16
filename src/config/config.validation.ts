import Joi from "joi";

export class ConfigValidation {
    static readonly schema = Joi.object({
        PORT: Joi.number().port().required(),
        EMAIL_USER: Joi.string().email().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().token().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().token().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    });

    static readonly options: Joi.ValidationOptions = {
        convert: true,
    };
}
