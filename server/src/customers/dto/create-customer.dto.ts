import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Customer Name is required' })
  @MaxLength(50, {
    message: 'Customer Name must be less than or equal to 50 characters',
  })
  name: string;

  @IsOptional()
  @MaxLength(50, {
    message: 'Nickname must be less than or equal to 50 characters',
  })
  nickname?: string;

  @IsOptional()
  @MaxLength(15, {
    message: 'Phone Number must be less than or equal to 15 characters',
  })
  phone?: string;

  @IsOptional()
  @MaxLength(150, {
    message: 'Address must be less than or equal to 150 characters',
  })
  address?: string;

  @IsOptional()
  @MaxLength(150, {
    message: 'Other field must be less than or equal to 150 characters',
  })
  other?: string;

  @IsBoolean({
    message: 'Customer Type must be a boolean',
  })
  isSelf: boolean;
}
