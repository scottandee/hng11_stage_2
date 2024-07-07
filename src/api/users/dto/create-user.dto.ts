import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string; // must not be null

  @IsNotEmpty()
  @IsString()
  lastName: string; // must not be null

  @IsNotEmpty()
  @IsString()
  email: string; // must be unique and must not be null

  @IsNotEmpty()
  @IsString()
  password: string; // must not be null

  @IsOptional()
  @IsString()
  phone?: string;
}
