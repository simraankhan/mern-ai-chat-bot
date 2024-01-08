import { connect, disconnect } from "mongoose";

export const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URL);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to the db");
  }
};

export const disconnectDB = async () => {
  try {
    await disconnect();
  } catch (error) {
    console.error(error);
    throw new Error("Unable to disconnect from the db");
  }
};
