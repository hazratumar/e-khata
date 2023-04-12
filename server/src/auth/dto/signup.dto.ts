import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, validate, ValidationError } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @MinLength(3)
  @Transform(({ value }) => (value as string).toLowerCase().replace(/[ ]/gi, '-'))
  @Matches(/^[a-z0-9-]+$/, {
    message: 'username can contain only lowercase characters, numbers and hyphens',
  })
  username: string;

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
        property: 'confirmPassword',
        value: this.confirmPassword,
        constraints: {
          matchesPassword: 'Password and confirm password fields do not match',
        },
      });
    }
    return errors;
  }
}