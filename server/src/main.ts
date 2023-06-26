import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module";

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const appUrl = configService.get<string>("app.clientUrl");

  // Middleware
  app.enableCors({ origin: [appUrl], credentials: true });
  app.enableShutdownHooks();

  // Pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Server Port
  const serverPort = configService.get<number>("app.serverPort");
  await app.listen(serverPort);
  Logger.log(`Server is up and running! 🚀 🚀 🚀`, serverPort);
};
bootstrap();
