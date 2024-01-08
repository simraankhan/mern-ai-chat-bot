import { CookieOptions, NextFunction, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import User from "../model/User.js";
import {
  CommonResponse,
  UserLoginRequest,
  UserSignUpRequest,
} from "../types/index.js";
import { createToken } from "../utils/token-manager.js";
import { Constants } from "../utils/constants.js";

export const getAllUsers = async (
  req: Request,
  res: Response<CommonResponse>,
  next: NextFunction
) => {
  try {
    const users = await User.find().select(["email", "name", "_id"]);
    return res.status(200).send({
      data: users,
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    return res.status(error?.status ?? 500).send({
      data: error,
      message: "Error",
    });
  }
};

export const userSignUp = async (
  req: Request<any, any, UserSignUpRequest>,
  res: Response<CommonResponse>,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hasPassword });
    await user.save();

    createCookieAndStore(res, { id: user._id.toString(), email: user.email });

    return res.status(201).send({
      message: "Created",
      data: user["_id"].toString(),
    });
  } catch (error) {
    console.error(error);
    return res.status(error?.status ?? 500).send({
      data: error,
      message: "Error",
    });
  }
};

export const userLogin = async (
  req: Request<any, any, UserLoginRequest>,
  res: Response<CommonResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }
    const isValidPassword = await bcrypt.compare(password, user["password"]);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }
    createCookieAndStore(res, { id: user._id.toString(), email: user.email });

    return res.status(200).json({
      message: "OK",
      data: {
        email: user.email,
        name: user.name,
        id: user._id.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(error?.status ?? 500).send({
      data: error,
      message: "Error",
    });
  }
};

export const verifyUser = async (
  req: Request<any, any, UserLoginRequest>,
  res: Response<CommonResponse>,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }

    return res.status(200).json({
      message: "OK",
      data: {
        email: user.email,
        name: user.name,
        id: user._id.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(error?.status ?? 500).send({
      data: error,
      message: "Error",
    });
  }
};

const createCookieAndStore = (
  res: Response,
  payload: { id: string; email: string }
) => {
  const cookieOptions: CookieOptions = {
    path: "/",
    domain: process.env.FE_DOMAIN,
    httpOnly: true,
    signed: true,
  };

  res.clearCookie(Constants.AUTH_COOKIE_NAME, cookieOptions);

  const token = createToken(payload.id, payload.email);

  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  cookieOptions["expires"] = expires;

  res.cookie(Constants.AUTH_COOKIE_NAME, token, cookieOptions);
};
