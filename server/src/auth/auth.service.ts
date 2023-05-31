import {
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

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly UsersService: UsersService
  ) {}

  async signup(dto: SignUpDto): Promise<Tokens> {
    const user = await this.UsersService.create(dto);
    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.UsersService.findByEmail(dto.email);

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches)
      throw new ForbiddenException(
        "Authentication failed - incorrect password"
      );

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(id: number): Promise<boolean> {
    await this.UsersService.findOne(id);
    await this.UsersService.refreshToken(id, null);
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.UsersService.findOne(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException("Access Denied");

    const rtMatches = await argon.verify(user.refreshToken, rt);
    if (!rtMatches) throw new ForbiddenException("Access Denied");

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<Tokens> {
    const user = await this.UsersService.findByEmail(email);
    const oldPasswordMatches = await argon.verify(user.password, oldPassword);

    if (!oldPasswordMatches) {
      throw new ForbiddenException(
        "Your old password is incorrect. Please try again."
      );
    }

    const hash = await argon.hash(newPassword);
    await this.UsersService.update(user.id, { password: hash });

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  generateOTP() {
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
    const user = await this.UsersService.findByEmail(email);

    const oneTimePassword = await this.generateOTP();

    const hash = await argon.hash(oneTimePassword);

    await this.UsersService.update(user.id, { otp: hash });

    // await this.sendOTPEmail(user, oneTimePassword);

    return oneTimePassword;
  }
  isOtpExpired(updatedAt): boolean {
    const expiryTime = new Date(updatedAt);
    expiryTime.setMinutes(expiryTime.getMinutes() + 2); // add 2 minutes
    const currentTime = new Date();
    return expiryTime < currentTime;
  }

  async submitOTP(email: string, otp: string): Promise<Tokens> {
    const user = await this.UsersService.findByEmail(email);

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

    if (this.isOtpExpired(user.updatedAt)) {
      throw new ForbiddenException(
        "Your OTP has expired. Please request a new OTP and try again."
      );
    }

    await this.UsersService.update(user.id, { otp: null });

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.UsersService.refreshToken(userId, hash);
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

    const [at, rt] = await Promise.all([
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
      access_token: at,
      refresh_token: rt,
    };
  }
}
