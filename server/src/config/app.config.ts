import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  serverPort: parseInt(process.env.SERVER_PORT, 10),
  clientUrl: process.env.CLIENT_URL,
  secretKey: process.env.SECRET_KEY,
}));
