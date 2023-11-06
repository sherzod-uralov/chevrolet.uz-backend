import Joi from "joi";

function validateUser(user:object) {
    const schema = Joi.object({
      username: Joi.string().regex(/^[A-Z][a-z]+$/).required(),
      password: Joi.string().min(8).required(),
      checkpassword: Joi.ref('password'),
    });
  
    return schema.validate(user);
  }
  

  export {validateUser}