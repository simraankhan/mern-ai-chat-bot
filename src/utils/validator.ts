import { NextFunction, Request, Response } from "express";
import { body, validationResult, ContextRunner } from "express-validator";
import User from "../model/User.js";
import { ResultWithContext } from "express-validator/src/chain/context-runner.js";

export const customValidator = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validationPromises: Promise<ResultWithContext>[] = [];
    validations.forEach((validation) => {
      validationPromises.push(validation.run(req));
    });

    const results = await Promise.all(validationPromises);
    if (results.every((item) => item.isEmpty())) {
      return next();
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: errors.array(),
    });
  };
};

export const signUpValidations = [
  // Name validations
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Invalid name"),
  // Email validations
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("Sign-Up failed");
      }
    }),
  // Password validation
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Invalid password")
    .isLength({ min: 6 })
    .withMessage("Password should contain atleast 6 characters")
    .custom((value, { req }) => {
      if (!req.body["confirmPassword"]) {
        throw new Error("Confirm password required");
      }
      if (req.body["confirmPassword"] !== value) {
        throw new Error("Password not match");
      }
      return value === req.body["confirmPassword"];
    }),
];

export const loginValidations = [
  // Email validations
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),
  // Password validation
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Invalid password"),
];

export const newChatValidations = [
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Invalid"),
];
