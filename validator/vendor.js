import Joi from "joi";
const validator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
        .email({ tlds: { allow: ["com", "net", "org"] } })
        .required()
        .messages({
          "string.base": "Email should be a type of 'text'.",
          "string.empty": "Email cannot be an empty field.",
          "string.email": "Invalid email format.",
          "any.required": "Email is a required field.",
        }),
        fullName: Joi.string()
        .min(3)
        .pattern(/^[a-zA-Z\s]+$/)
        .max(30)
        .required()
        .messages({
          "string.base": `Full Name should be a type of 'text'.`,
          "string.empty": `Full Name cannot be an empty field.`,
          "string.min": `Full Name should have a minimum length of 3.`,
          "string.pattern.base": `Full Name should only contain alphabets, spaces, and other characters.`,
          "any.required": `Full Name is a required field.`,
        }),
      password: Joi.string().min(8).required().pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).messages({
        "string.base": "Password should be a type of 'text'.",
        "string.empty": "Password cannot be an empty field.",
        "string.min": "Password should have a minimum length of 8.",
        "string.pattern.base": "Password should be a mix of text and numbers.",
        "any.required": "Password is a required field.",
    }),
    phoneNumber:Joi.string().length(10).pattern(/^[0-9]+$/).required()
    .messages({
      'string.pattern.base': `Phone number must have 10 digits.`,
      "string.empty": "Phone cannot be an empty field.",
    }),
    })
    const validation = schema.validate(req.body,{abortEarly:false});
    const { error } = validation;
  if (error) {
    const errors = error.details.map(detail => detail.message);
    console.log(error);
    return res.status(403).json({ message: "Invalid input", errors });
}
    next()
  };

  export default validator;