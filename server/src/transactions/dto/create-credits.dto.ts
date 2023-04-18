import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class Credits {
  @IsNotEmpty({ message: "Credit From is required" })
  @IsNumber({}, { message: "Credit From must be a number" })
  creditFrom: number;

  @IsNotEmpty({ message: "Credit To is required" })
  @IsNumber({}, { message: "Credit To must be a number" })
  creditTo: number;

  @IsNotEmpty({ message: "Currency is required" })
  @IsNumber({}, { message: "Currency must be a number" })
  currency: number;

  @IsNotEmpty({ message: "Amount is required" })
  @IsNumber({}, { message: "Amount must be a number" })
  @Transform(({ value }) => (value === "" || value === null ? 0 : value))
  amount: number;
}
