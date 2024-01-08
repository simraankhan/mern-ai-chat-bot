import { NextFunction, Request, Response } from "express";
import { CommonResponse, NewChatResource } from "../types/index.js";
import User, { OpenAIRole } from "../model/User.js";
import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import { configuerOpenAI } from "../config/openai.config.js";

export const newChat = async (
  req: Request<any, any, NewChatResource>,
  res: Response<CommonResponse>,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: "UnAuthorized" });

    const chats: ChatCompletionRequestMessage[] = user.chats.map(
      ({ content, role }) => {
        return {
          role: role as OpenAIRole,
          content,
        };
      }
    );

    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });
    const config = configuerOpenAI();

    const openai = new OpenAIApi(config);

    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chats,
    });
    user.chats.push(chatResponse.data.choices[0].message);
    await user.save();
    return res.status(200).json({
      message: "OK",
      data: user.chats,
    });
  } catch (error) {
    console.error(error);
    return res.status(error?.status ?? 500).send({
      data: error,
      message: "Error",
    });
  }
};
