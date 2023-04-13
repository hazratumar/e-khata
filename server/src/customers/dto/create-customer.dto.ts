import { IsNotEmpty, IsEmail, IsOptional, MaxLength } from "class-validator";

export class CreateCustomerDto {
  @IsNotEmpty({ message: "Customer Name is required" })
  @MaxLength(50, {
    message: "Customer Name must be less than or equal to 50 characters",
  })
  name: string;

  @IsOptional()
  @MaxLength(50, {
    message: "Nickname must be less than or equal to 50 characters",
  })
  nickname?: string;

  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsOptional()
  @MaxLength(50, {
    message: "Email must be less than or equal to 50 characters",
  })
  email?: string;

  @IsNotEmpty({ message: "Phone number is required" })
  @MaxLength(15, {
    message: "Phone number must be less than or equal to 15 characters",
  })
  phone: string;

  @IsOptional()
  @MaxLength(100, {
    message: "Address must be less than or equal to 100 characters",
  })
  address?: string;

  @IsOptional()
  @MaxLength(500, {
    message: "Other field must be less than or equal to 500 characters",
  })
  other?: string;
}
