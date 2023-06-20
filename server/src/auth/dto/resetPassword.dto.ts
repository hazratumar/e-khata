import { MinLength, MaxLength, IsString, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: "Old Password is required" })
  oldPassword: string;

  @MinLength(6, { message: "New password must be at least 6 characters long." })
  @MaxLength(10, { message: "New password cannot exceed 10 characters." })
  newPassword: string;

  @MinLength(6, {
    message: "Confirm password must be at least 6 characters long.",
  })
  @MaxLength(10, { message: "Confirm password cannot exceed 10 characters." })
  confirmPassword: string;
}
