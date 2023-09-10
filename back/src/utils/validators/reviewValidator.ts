import joi from "joi";
import { NextFunction, Response } from "express";
import { IRequest } from "user";
import { errorGenerator } from "../errorGenerator";

const errorMessage = {
  stringBase: "문자여야합니다.",
  stringMin: "4글자이상이여야합니다.",
  stringMax: "300글자이하이여야합니다.",
};

const validateSchema = (schema: joi.ObjectSchema) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      const customError = errorGenerator(errorMessage, 400);
      throw customError;
    }
    next();
  };
};

const postreviewSchema = joi.object({
  title: joi.string().min(4).required().messages({
    "string.base": errorMessage.stringBase,
    "string.min": errorMessage.stringMin,
  }),
  content: joi.string().min(4).max(300).required().messages({
    "string.base": errorMessage.stringBase,
    "string.min": errorMessage.stringMin,
    "string.max": errorMessage.stringMax,
  }),
  uploadFile: joi.array().items(joi.string()).optional(),
  uploadVideo: joi.array().items(joi.string()).optional(),
});

const putreviewSchema = joi.object({
  title: joi.string().min(4).optional().messages({
    "string.base": errorMessage.stringBase,
    "string.min": errorMessage.stringMin,
  }),
  content: joi.string().min(4).max(300).optional().messages({
    "string.base": errorMessage.stringBase,
    "string.min": errorMessage.stringMin,
    "string.max": errorMessage.stringMax,
  }),
  uploadFile: joi.array().items(joi.string()).optional(),
  uploadVideo: joi.array().items(joi.string()).optional(),
});

export const postReviewValidator = validateSchema(postreviewSchema);

export const putReviewValidator = validateSchema(putreviewSchema);
