import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { SignInDto, SignUpDto } from './dto';
import { JwtPayload, Tokens } from './types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) { }


  async signup(dto: SignUpDto): Promise<Tokens> {
    const user = await this.userService.create(dto);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signin(dto: SignInDto): Promise<Tokens> {
    const user = await this.userService.findByEmail(dto.email);

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Authentication failed - incorrect password');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signout(id: number): Promise<boolean> {
    await this.userService.findOne(id);//--------------->
    await this.userService.update(id, { refreshToken: null })
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.userService.findOne(userId)

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.refreshToken, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async forgetPassword(email: string, oldPassword: string, newPassword: string): Promise<Tokens> {
    const user = await this.userService.findByEmail(email);
    const oldPasswordMatches = await argon.verify(user.password, oldPassword);

    if (!oldPasswordMatches) {
      throw new ForbiddenException('Your old password is incorrect. Please try again.');
    }

    const hash = await argon.hash(newPassword);
    await this.userService.update(user.id, { password: hash });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }


  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.userService.update(userId, { refreshToken: hash });
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}