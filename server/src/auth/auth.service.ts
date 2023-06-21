import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { LoginDto, SignUpDto } from "./dto";
import { JwtPayload, Tokens } from "./types";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { ResetPasswordDto } from "./dto/resetPassword.dto";

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

  // async sendOTPEmail(user, oneTimePassword) {
  //   var transport = nodemailer.createTransport({
  //     service: "gmail",
  //     port: 465,
  //     secure: false,
  //     auth: {
  //      type: 'OAuth2',
  //       user: process.env.MAIL_USERNAME,
  //       pass: process.env.MAIL_PASSWORD,
  //       clientId: process.env.OAUTH_CLIENTID,
  //       clientSecret: process.env.OAUTH_CLIENT_SECRET,
  //       refreshToken: process.env.OAUTH_REFRESH_TOKEN
  //     }
  //   });
  //   var mailOptions = {
  //     from: `${emailSender[0]?.email}`,
  //     to: `${user?.email}`,
  //     subject: `Recovery email verified for your ${emailSender[0]?.longName} account`,
  //     text: `Dear Sir/Madam ${user?.name} please collect your ${emailSender[0]?.longName} account verification code ${oneTimePassword}.`
  //   };
  //   transport.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('The verification email has been successfully sent.: ' + info.response);
  //       return res.status(200).json({ msg: "The verification email successfully sent", email: response?.email });
  //     }
  //   });
  // }

  async sendOTP(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);

    const oneTimePassword = await this.generateOTP();

    const hash = await argon.hash(oneTimePassword);

    await this.usersService.update(user.id, { otp: hash });

    // await this.sendOTPEmail(user, oneTimePassword);

    return oneTimePassword;
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
        expiresIn: "15h",
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: "7d",
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
