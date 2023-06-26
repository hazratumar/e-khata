import { registerAs } from "@nestjs/config";

export default registerAs("email", () => ({
  authUser: process.env.AUTH_USER,
  authPass: process.env.AUTH_PASSS,
}));
