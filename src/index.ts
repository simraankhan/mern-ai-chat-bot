import app from "./app.js";
import { connectDB } from "./utils/db-connection.js";

const bootstrap = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port - ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

// Connection & listening
bootstrap();
