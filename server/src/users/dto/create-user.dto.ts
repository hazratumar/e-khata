import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  validate,
  ValidationError,
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

  @MinLength(6)
  password: string;

  @MinLength(6)
  confirmPassword: string;

  async validate(): Promise<ValidationError[]> {
    const errors = await validate(this);
    if (this.password !== this.confirmPassword) {
      errors.push({
        target: this,
        property: "confirmPassword",
        value: this.confirmPassword,
        constraints: {
          matchesPassword: "Password and confirm password fields do not match",
        },
      });
    }
    return errors;
  }
}
