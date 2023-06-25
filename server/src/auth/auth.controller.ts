import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { GetCurrentUser, GetCurrentUserId, Public } from "../common/decorators";
import { RtGuard } from "../common/guards";
import { AuthService } from "./auth.service";
import { Tokens } from "./types";
import { LoginDto, SignUpDto } from "./dto";
import { ResetPasswordDto } from "./dto/resetPassword.dto";
import { ForgotPasswordDto } from "./dto/forgotPassword.dto.ts";
import { SubmitOtpDto } from "./dto/submitOtp.dto.ts";
import { NewPasswordDto } from "./dto/newPassword.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  signup(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signup(signUpDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(+userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser("refreshToken") refreshToken: string
  ): Promise<Tokens> {
    return this.authService.refreshTokens(+userId, refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Put("reset-password")
  resetPassword(
    @GetCurrentUserId() userId: string,
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<Tokens> {
    return this.authService.resetPassword(+userId, resetPasswordDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Put("forget-password")
  sendOTP(
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string }> {
    return this.authService.sendOTP(forgotPasswordDto?.email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Put("submit-otp")
  submitOTP(@Body() submitOtpDto: SubmitOtpDto): Promise<{ message: string }> {
    return this.authService.submitOTP(submitOtpDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Put("new-password")
  newPassword(@Body() newPasswordDto: NewPasswordDto): Promise<Tokens> {
    return this.authService.newPassword(newPasswordDto);
  }
}
