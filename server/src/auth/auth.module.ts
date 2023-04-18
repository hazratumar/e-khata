import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AtStrategy, RtStrategy } from "./strategies";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [JwtModule.register({}), forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
