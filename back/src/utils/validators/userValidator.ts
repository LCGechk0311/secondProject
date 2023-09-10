// import { NextFunction, Response } from "express";
// import joi, { ObjectSchema } from "joi";
// import { IRequest } from "user";
// import { errorGenerator } from "../errorGenerator";

// const nameReg: RegExp = /^[a-zA-Z-H]+$/;
// const passwordReg: RegExp = /^[a-zA-Z0-9!@#;:'-_=+,./?]+$/;

// const emailErrorMessage = {
//   "string.min": "이메일은 최소 5자 이상 입력해주세요.",
//   "string.max": "이메일은 최대 30자 이하로 입력해주세요.",
//   "any.required": "이메일을 입력해주세요.",
//   "string.email": "올바른 이메일 형식이 아닙니다.",
// };

// const nameErrorMessage = {
//   "string.min": "이름은 최소 2자 이상 입력해주세요.",
//   "string.max": "이름은 최대 20자까지 입력 가능합니다.",
//   "any.required": "이름을 입력해주세요.",
//   "string.pattern.base": "이름은 한글 또는 영문 대소문자만 입력 가능합니다.",
// };

// const passwordErrorMessage = {
//   "string.min": "비밀번호는 최소 4자 이상 입력해주세요.",
//   "string.max": "비밀번호는 30자 이하로 입력해주세요.",
//   "any.required": "비밀번호를 입력해주세요.",
//   "string.pattern.base":
//     "비밀번호는 대소문자, 숫자 및 특수 문자 (!@#;:'-_=+,./?)만 입력 가능합니다.",
// };

// const loginSchema: ObjectSchema<any> = {
//   email: joi
//     .string()
//     .min(5)
//     .max(30)
//     .required()
//     .email()
//     .messages({ ...emailErrorMessage }),
//   password: joi
//     .string()
//     .min(4)
//     .max(30)
//     .required()
//     .pattern(passwordReg)
//     .messages({ ...passwordErrorMessage }),
// };

// const signUpSchema: ObjectSchema<any> = {
//   ...loginSchema,
//   name: joi
//     .string()
//     .min(2)
//     .max(20)
//     .required()
//     .pattern(nameReg)
//     .messages({ ...nameErrorMessage }),
// };

// const updateSchema: ObjectSchema<any> = {
//   ...signUpSchema,
//   description: joi.string().optional(),
//   uploadFile: joi.any(),
// };

// const validateSchema =
//   (schema: ObjectSchema<any>) =>
//   (req: IRequest, res: Response, next: NextFunction) => {
//     const { error } = schema.validate(req.body);

//     if (error) {
//       const err = errorGenerator(error.details[0].message, 400);
//       next(err);
//     }

//     next();
//   };

// export const validateLogin = validateSchema(loginSchema);
// export const validateSignUp = validateSchema(signUpSchema);
// export const validateUpdateUser = validateSchema(updateSchema);

import { NextFunction, Response } from "express";
import joi from "joi";
import { IRequest } from "user";
import { errorGenerator } from "../errorGenerator";

const nameReg: RegExp = /^[a-zA-Z가-힣]+$/;
const passwordReg: RegExp = /^[a-zA-Z0-9!@#;:'-_=+,./?]+$/;

const emailErrorMessage = {
  "string.min": "Email은 5자 이상 입력해주십시오.",
  "string.max": "Email은 30자 이하로 입력해주십시오.",
  "any.required": "Email을 입력해주십시오.",
  "string.email": "Eamil형식이 유효하지 않습니다.",
};

const nameErrormessage = {
  "string.min": "이름은 2자 이상 입력해주십시오.",
  "string.max": "이름은 20자 이하로 입력해주십시오.",
  "any.required": "이름을 입력해주십시오.",
  "string.pattern.base": "이름은 한글 또는 영문 대소문자만 입력가능합니다.",
};

const passwordErrorMessage = {
  "string.min": "비밀번호는 4자 이상 입력해주십시오.",
  "string.max": "비밀번호는 30자 이하로 입력해주십시오.",
  "any.required": "비밀번호를 입력해주십시오.",
  "string.pattern.base":
    "비밀번호는 영문 대소문자, 숫자, 특수문자(!@#;:'-_=+,./?)만 입력가능합니다.",
};

const validateSchema = {
  name: joi
    .string()
    .min(2)
    .max(20)
    .required()
    .pattern(nameReg)
    .messages({ ...nameErrormessage }),
  email: joi
    .string()
    .min(5)
    .max(30)
    .required()
    .email()
    .messages({ ...emailErrorMessage }),
  password: joi
    .string()
    .min(4)
    .max(30)
    .required()
    .pattern(passwordReg)
    .messages({ ...passwordErrorMessage }),
  description: joi.string().optional(),
  uploadFile: joi.any(),
};

export const validateSignUp = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  const schema = joi.object({
    name: validateSchema.name,
    email: validateSchema.email,
    password: validateSchema.password,
  });

  const { error } = schema.validate({ name, email, password });

  if (error) {
    const err = errorGenerator(error.details[0].message, 400);
    next(err);
  }

  next();
};

export const validateLogin = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const schema = joi.object({
    email: validateSchema.email,
    password: validateSchema.password,
  });

  const { error } = schema.validate({ email, password });

  if (error) {
    const err = errorGenerator(error.details[0].message, 400);
    next(err);
  }

  next();
};

export const validateUpdateUser = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const updateValue = req.body;

  const schema = joi.object({
    name: joi.string().min(2).max(20).optional().pattern(nameReg),
    description: joi.string().optional(),
    uploadFile: joi.any(),
  });

  const { error } = schema.validate(updateValue);

  if (error) {
    const err = errorGenerator(error.details[0].message, 400);
    next(err);
  }
  next();
};
