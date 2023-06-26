import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import * as Joi from "joi";

import databaseConfig from "./database.config";
import appConfig from "./app.config";
import emailConfig from "./email.config";

const validationSchema = Joi.object({
  //App
  SERVER_PORT: Joi.number().required(),
  CLIENT_URL: Joi.string().trim().required(),
  SECRET_KEY: Joi.string().trim().required(),

  //Email
  AUTH_USER: Joi.string().trim().required(),
  AUTH_PASS: Joi.string().trim().required(),

  // Database
  POSTGRES_HOST: Joi.string().trim().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_DB: Joi.string().trim().required(),
  POSTGRES_USERNAME: Joi.string().trim().required(),
  POSTGRES_PASSWORD: Joi.string().trim().required(),
  POSTGRES_SSL_CERT: Joi.string().trim().allow(""),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, emailConfig, databaseConfig],
      validationSchema: validationSchema,
      envFilePath: "../.env",
    }),
  ],
})
export class ConfigModule {}
