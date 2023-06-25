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

@Injectable()
export class AuthService {
  constructor(
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

  async sendOtpThroughEmail(user, oneTimePassword) {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: "ronny80@ethereal.email",
          pass: "W4a6qPPT1hKEg71VkA",
        },
      });

      let htmlContent = `
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
          <h1>Rahat Shinwari Enterprises - OTP Verification</h1>
          <p>Dear ${user?.name},</p>
          <p>Your One Time Password (OTP) for verification is: ${oneTimePassword}</p>
          <p>Please use this OTP to complete your verification process.</p>
        </body>
      </html>
    `;

      let info = await transporter.sendMail({
        from: "noreplay@gmail.com",
        to: user.email,
        subject: "OTP Verification",
        html: htmlContent,
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error(error);
    }
  }

  async sendOTP(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);

    const oneTimePassword = await this.generateOTP();

    const hash = await argon.hash(oneTimePassword);

    await this.sendOtpThroughEmail(user, oneTimePassword);

    await this.usersService.update(user.id, { otp: hash });

    return "OTP sent successfully.";
  }

  isOTPExpired(updatedAt: Date): boolean {
    const expiryTime = new Date(updatedAt);
    expiryTime.setMinutes(expiryTime.getMinutes() + 2);
    const currentTime = new Date();
    return expiryTime < currentTime;
  }

  async submitOTP(email: string, otp: string): Promise<Tokens> {
    const user = await this.usersService.findByEmail(email);

    if (!user?.otp) {
      throw new HttpException(
        "Please check and try again with a valid OTP.",
        HttpStatus.NOT_FOUND
      );
    }

    const isOtpCorrect = await argon.verify(user.otp, otp);
    if (!isOtpCorrect) {
      throw new ForbiddenException("Your OTP is incorrect. Please try again.");
    }

    if (this.isOTPExpired(user.updatedAt)) {
      throw new ForbiddenException(
        "Your OTP has expired. Please request a new OTP and try again."
      );
    }

    await this.usersService.update(user.id, { otp: null });

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
