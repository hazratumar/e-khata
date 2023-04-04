import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Not, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email } = createUserDto;

    // Check if a user with the same username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      // If a user with the same username and email exists, throw an error
      if (existingUser.username === username && existingUser.email === email) {
        throw new HttpException(
          "Username and email already taken",
          HttpStatus.CONFLICT
        );
      }
      // If a user with the same username exists, throw an error
      else if (existingUser.username === username) {
        throw new HttpException("Username already taken", HttpStatus.CONFLICT);
      }
      // If a user with the same email exists, throw an error
      else {
        throw new HttpException("Email already taken", HttpStatus.CONFLICT);
      }
    }

    // If no user with the same username or email exists, create a new user and save it to the database
    const user = await this.userRepository.create(createUserDto);

    await this.userRepository.save(user);

    return user;
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

  async findByUsername(username: string): Promise<User> {
    // Find a user by their username
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      // If no user with the given username is found, throw an error
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Find the existing user in the database
    const existingUser = await this.userRepository.findOne({ where: { id } });

    // If the user doesn't exist, throw an error
    if (!existingUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    // Check if the desired username is already taken by another user
    const { username, email } = updateUserDto;
    const usernameTaken = await this.userRepository.findOne({
      where: { username, id: Not(id) },
    });

    // If the username is taken, throw an error
    if (usernameTaken) {
      throw new HttpException("Username already taken", HttpStatus.CONFLICT);
    }

    // Check if the desired email is already taken by another user
    const emailTaken = await this.userRepository.findOne({
      where: { email, id: Not(id) },
    });

    // If the email is taken, throw an error
    if (emailTaken) {
      throw new HttpException("Email already taken", HttpStatus.CONFLICT);
    }

    // Merge the existing user with the new data
    const updatedUser = { ...existingUser, ...updateUserDto };

    // Save the updated user to the database
    return this.userRepository.save(updatedUser);
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
