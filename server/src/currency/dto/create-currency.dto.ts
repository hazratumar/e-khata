import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateCurrencyDto {
  @IsNotEmpty({ message: "Currency name is required" })
  @MaxLength(20, {
    message: "Currency name must be less than or equal to 20 characters",
  })
  name: string;

  @IsNotEmpty({ message: "Abbreviation name is required" })
  @MaxLength(20, {
    message:
      "Currency Abbreviation must be less than or equal to 20 characters",
  })
  abbreviation: string;

  @IsNotEmpty({ message: "Rate is required" })
  rate: number;
}
