import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { LoginDto, SignUpDto } from "./dto";
import { JwtPayload, Tokens } from "./types";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { ResetPasswordDto } from "./dto/resetPassword.dto";
import * as nodemailer from "nodemailer";
import { SubmitOtpDto } from "./dto/submitOtp.dto.ts";
import { NewPasswordDto } from "./dto/newPassword.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  async signup(signUpDto: SignUpDto): Promise<Tokens> {
    await this.isPasswordSame(signUpDto.newPassword, signUpDto.confirmPassword);

    const user = await this.usersService.create(signUpDto);
    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async isPasswordSame(
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new HttpException(
        "New password and confirm password do not match.",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findByEmail(dto.email);

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      throw new ForbiddenException("Incorrect password");
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(id: number): Promise<boolean> {
    await this.usersService.findOne(id);
    await this.usersService.refreshToken(id, null);
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException("Access Denied");
    }

    const rtMatches = await argon.verify(user.refreshToken, rt);
    if (!rtMatches) {
      throw new ForbiddenException("Access Denied");
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async resetPassword(
    userId: number,
    resetPasswordDto: ResetPasswordDto
  ): Promise<Tokens> {
    await this.isPasswordSame(
      resetPasswordDto.newPassword,
      resetPasswordDto.confirmPassword
    );

    const user = await this.usersService.findOne(userId);
    const oldPasswordMatches = await argon.verify(
      user.password,
      resetPasswordDto.oldPassword
    );

    if (!oldPasswordMatches) {
      throw new HttpException(
        "Your old password is incorrect. Please try again.",
        HttpStatus.UNAUTHORIZED
      );
    }

    const hash = await argon.hash(resetPasswordDto.newPassword);
    await this.usersService.update(user.id, { password: hash });

    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  generateOTP(): string {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  async sendOtpThroughGmail(user, oneTimePassword) {
    const authUser = this.configService.get<string>("email.authUser");
    const authPass = this.configService.get<string>("email.authPass");

    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: false,
        auth: {
          user: authUser,
          pass: authPass,
        },
      });

      const htmlContent = `
      <html>
        <head>
          <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 10px;
          }
          .otp-container {
            background-color: #f1f1f1;
            padding: 10px;
            border-radius: 4px;
            font-size: 18px;
            margin-bottom: 20px;
          }
          .otp-label {
            color: #555;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            margin-right: 10px;
          }
        </style>
      </head>
      <body>
        <h3>Rahat Shinwari Enterprises - OTP Verification</h3>
        <p>Dear ${user?.name},</p>
        <p>Your One Time Password (OTP) for verification is: ${oneTimePassword}</p>
        <p>Please use this OTP to complete your verification process.</p>
      </body>
    </html>`;

      await transporter.sendMail({
        from: authUser,
        to: user.email,
        subject: "OTP Verification",
        html: htmlContent,
      });
    } catch (error) {
      if (error?.errno === -3008) {
        throw new HttpException(
          "Check internet connection. Try again.",
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        "Failed to send OTP email.",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async sendOTP(email: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new Error("User not found");
      }

      const oneTimePassword = await this.generateOTP();
      const hash = await argon.hash(oneTimePassword);

      await this.sendOtpThroughGmail(user, oneTimePassword);
      await this.usersService.update(user.id, { otp: hash });

      return { message: "OTP has been successfully sent." };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  isOTPExpired(updatedAt: Date, expiryTime: number) {
    const generateTime = new Date(updatedAt);
    generateTime.setMinutes(generateTime.getMinutes() + expiryTime);
    const currentTime = new Date();
    return generateTime < currentTime;
  }

  async checkOTPValidity(
    user: User,
    otp: string,
    expiryTime: number
  ): Promise<void> {
    if (!user?.otp) {
      throw new HttpException(
        "Check and try with valid OTP.",
        HttpStatus.NOT_FOUND
      );
    }

    const isOtpCorrect = await argon.verify(user.otp, otp);
    if (!isOtpCorrect) {
      throw new HttpException(
        "Your OTP is incorrect. Try again.",
        HttpStatus.FORBIDDEN
      );
    }

    const isOtpExpired = this.isOTPExpired(user.updatedAt, expiryTime);
    if (isOtpExpired) {
      throw new HttpException("Your OTP has expired.", HttpStatus.FORBIDDEN);
    }
  }

  async submitOTP(submitOtpDto: SubmitOtpDto): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findByEmail(submitOtpDto.email);

      await this.checkOTPValidity(user, submitOtpDto.otp, 2);

      return { message: "OTP submitted successfully." };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          "An error occurred while submitting OTP.",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async newPassword(newPasswordDto: NewPasswordDto): Promise<Tokens> {
    const user = await this.usersService.findByEmail(newPasswordDto.email);

    await this.checkOTPValidity(user, newPasswordDto.otp, 5);

    await this.isPasswordSame(
      newPasswordDto.newPassword,
      newPasswordDto.confirmPassword
    );

    const hash = await argon.hash(newPasswordDto.newPassword);

    await this.usersService.update(user.id, {
      password: hash,
      otp: null,
    });

    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRefreshTokenHash(
    userId: number,
    refreshToken: string
  ): Promise<void> {
    const hash = await argon.hash(refreshToken);
    await this.usersService.refreshToken(userId, hash);
  }

  async getTokens(user: User): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      image: user.image,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: "7d",
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: "30d",
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
