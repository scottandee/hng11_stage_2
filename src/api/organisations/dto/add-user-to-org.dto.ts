import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserToOrgDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
