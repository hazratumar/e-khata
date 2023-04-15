import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
  ValidateIf,
} from "class-validator";

export class CreateCurrencyDto {
  @IsNotEmpty({ message: "Currency name is required" })
  @MaxLength(20, {
    message: "Currency name must be less than or equal to 20 characters",
  })
  name: string;

  @ValidateIf((o) => o.rate !== "")
  @IsNumberString({}, { message: "Currency rate must be a number." })
  @MaxLength(10, {
    message: "Currency rate must be less than or equal to 10 digits.",
  })
  @IsOptional()
  rate: string;
}
