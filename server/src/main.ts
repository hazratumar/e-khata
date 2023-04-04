import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT;
  await app.listen(port);
  Logger.log(`Server is up and running! 🚀 🚀 🚀`, port);
}
bootstrap();
