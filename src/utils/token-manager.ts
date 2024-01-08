import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Constants } from "./constants.js";

export const createToken = (
  id: string,
  email: string,
  expiresIn: number | string = "7d"
) => {
  const payload = { id, email };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[Constants.AUTH_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  return new Promise<void>((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
      if (error) {
        reject();
        return res.status(401).json({ message: "UnAuthorized" });
      } else {
        resolve();
        res.locals.jwtData = data;
        return next();
      }
    });
  });
};
