import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as argon from "argon2";
import { AuthService } from "src/auth/auth.service";
import { Tokens } from "src/auth/types";
import { extname } from "path";

@Injectable()
export class UsersService {
  private readonly allowedExtensions = [".jpg", ".jpeg", ".png"];
  private readonly maxFileSizeInBytes = 5242880; // 5 MB

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.authService.isPasswordSame(
      createUserDto.newPassword,
      createUserDto.confirmPassword
    );
    const hash = await argon.hash(createUserDto.newPassword);
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }],
    });
    if (existingUser) {
      throw new HttpException(`Email already taken`, HttpStatus.CONFLICT);
    }
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (users.length === 0) {
      throw new HttpException("No users found", HttpStatus.NOT_FOUND);
    }
    return users;
  }

  async findOne(id: number): Promise<User> {
    return this.findUserById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.findUserByEmail(email);
  }

  async refreshToken(id: number, token: string): Promise<User> {
    const existingUser = await this.findUserById(id);
    const updatedUser = { ...existingUser, token };
    return this.userRepository.save(updatedUser);
  }

  validateBase64Image(image: string): void {
    const base64Regex = /^data:image\/(png|jpg|jpeg);base64,/;
    if (!base64Regex.test(image)) {
      throw new HttpException("Invalid image format", HttpStatus.BAD_REQUEST);
    }

    const ext = extname(image.split(";")[0].split("/")[1]);
    if (!this.allowedExtensions.includes(ext)) {
      throw new HttpException(
        "Invalid image type",
        HttpStatus.UNSUPPORTED_MEDIA_TYPE
      );
    }

    const sizeInBytes = Buffer.byteLength(image, "base64");
    if (sizeInBytes > this.maxFileSizeInBytes) {
      throw new HttpException(
        `Image size exceeds ${this.maxFileSizeInBytes} bytes`,
        HttpStatus.PAYLOAD_TOO_LARGE
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Tokens> {
    if (updateUserDto.image) {
      this.validateBase64Image(updateUserDto.image);
    }
    const existingUser = await this.findUserById(id);
    const { email } = updateUserDto;
    await this.checkEmailAvailability(email, id);
    const updatedUser = { ...existingUser, ...updateUserDto };
    const user = await this.userRepository.save(updatedUser);
    const tokens = await this.authService.getTokens(user);
    await this.authService.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token
    );
    return tokens;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
  }

  private async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private async checkEmailAvailability(
    email: string,
    userId: number
  ): Promise<void> {
    const userWithSameEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (userWithSameEmail && userWithSameEmail.id !== userId) {
      throw new HttpException("Email already taken", HttpStatus.CONFLICT);
    }
  }
}
