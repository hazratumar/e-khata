import { IsEmail, IsNotEmpty } from "class-validator";

export class SubmitOtpDto {
  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsNotEmpty({ message: "Email should not be empty" })
  email: string;

  @IsNotEmpty({ message: "OTP should not be empty" })
  otp: string;
}
