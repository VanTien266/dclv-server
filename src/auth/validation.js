const Joi = require('@hapi/joi');

// Register Validate
const registerValidationStaff = function(data){
    const schema = Joi.object ({
        name: Joi.string()
                .min(4)
                .required(),
        email: Joi.string()
                .email()
                .required(),
        password: Joi.string()
                .min(6)
                .required(),
        phone: Joi.string()
                .min(10)
                .max(11)
                .required(),
        address: Joi.string()
                .required(),
        birthday: Joi.date()
                .required(),
        gender: Joi.string()
                .required(),
        role: Joi.string()
                .required(),
                          
    })
   return  schema.validate(data)
}

const registerValidationCustomer = function(data){
    const schema = Joi.object ({
        name: Joi.string()
                .min(4)
                .required(),
        email: Joi.string()
                .email()
                .required(),
        password: Joi.string()
                .min(6)
                .required(),
        phone: Joi.string()
                .min(10)
                .max(11)
                .required(),
        address: Joi.string()
                .required(),
        birthday: Joi.date()
                .required(),
                          
    })
   return  schema.validate(data)
}

// Login Validate
const loginValidation = function(data){
    const schema = Joi.object ({
        email: Joi.string()
                .email()
                .required(),
        password: Joi.string()
                .min(6)
                .required(),   
    })
   return  schema.validate(data)
}

module.exports = {
    registerValidationCustomer,
    loginValidation,
    registerValidationStaff
}