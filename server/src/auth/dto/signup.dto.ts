import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  provider: 'email';
}