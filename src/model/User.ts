import { Schema, SchemaType, SchemaTypeOptions, model } from "mongoose";

export type OpenAIRole = "user" | "system" | "assistant" | "function";

const chatSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  chats: [chatSchema],
});

export default model("User", userSchema);
