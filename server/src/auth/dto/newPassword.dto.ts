import { MinLength, MaxLength, IsNotEmpty, IsEmail } from "class-validator";

export class NewPasswordDto {
  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsNotEmpty({ message: "Email should not be empty" })
  email: string;

  @IsNotEmpty({ message: "OTP should not be empty" })
  otp: string;

  @MinLength(6, { message: "New password must be at least 6 characters long." })
  @MaxLength(10, { message: "New password cannot exceed 10 characters." })
  newPassword: string;

  @MinLength(6, {
    message: "Confirm password must be at least 6 characters long.",
  })
  @MaxLength(10, { message: "Confirm password cannot exceed 10 characters." })
  confirmPassword: string;
}
