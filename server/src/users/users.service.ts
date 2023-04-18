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
    const hash = await argon.hash(createUserDto.password);
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
    // Find all users in the database
    const users = await this.userRepository.find();

    if (users.length === 0) {
      // If no users are found, throw an error
      throw new HttpException("No users found", HttpStatus.NOT_FOUND);
    }

    return users;
  }

  async findOne(id: number): Promise<User> {
    // Find a user by their ID
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      // If no user with the given ID is found, throw an error
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    // Find a user by their email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // If no user with the given email is found, throw an error
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return user;
  }
  async refreshToken(id: number, token: string): Promise<User> {
    // Find the existing user in the database
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    // Merge the existing user with the new data
    const updatedUser = { ...existingUser, token };

    // Save the updated user to the database
    return this.userRepository.save(updatedUser);
  }

  validateBase64Image(image: string): void {
    const base64regex = /^data:image\/(png|jpg|jpeg);base64,/;
    if (!base64regex.test(image)) {
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
    if (updateUserDto?.image) {
      await this.validateBase64Image(updateUserDto?.image);
    }
    // Find the existing user in the database
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    // Check if the provided email already exists for another user
    const { email } = updateUserDto;

    const userWithSameEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (userWithSameEmail && userWithSameEmail.id !== id) {
      throw new HttpException("Email already taken", HttpStatus.CONFLICT);
    }

    // Merge the existing user with the new data
    const updatedUser = { ...existingUser, ...updateUserDto };

    // Save the updated user to the database
    const user = await this.userRepository.save(updatedUser);
    const tokens = await this.authService.getTokens(user);
    await this.authService.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async remove(id: number): Promise<void> {
    // Delete the user from the database
    const result = await this.userRepository.delete({ id });

    // If no user was affected (i.e. the user doesn't exist), throw an error
    if (result.affected === 0) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
  }
}
