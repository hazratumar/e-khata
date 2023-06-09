import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @MinLength(3)
  @Transform(({ value }) =>
    (value as string).toLowerCase().replace(/[ ]/gi, "-")
  )
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6, { message: "New password must be at least 6 characters long." })
  @MaxLength(10, { message: "New password cannot exceed 10 characters." })
  newPassword: string;

  @MinLength(6, {
    message: "Confirm password must be at least 6 characters long.",
  })
  @MaxLength(10, { message: "Confirm password cannot exceed 10 characters." })
  confirmPassword: string;
}
