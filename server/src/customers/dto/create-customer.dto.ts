import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsNumberString,
  ValidateIf,
} from "class-validator";

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

  @ValidateIf((o) => o.phone !== "")
  @IsNumberString({}, { message: "Phone number must be a number." })
  @MaxLength(15, {
    message: "Phone number must be less than or equal to 15 characters",
  })
  @IsOptional()
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
