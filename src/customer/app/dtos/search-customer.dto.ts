import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SearchCustomerDto {
  @ApiProperty({ required: false })
  @ValidateIf((o) => (!o.lastName && !o.email) || o.name?.length === 0)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => (!o.name && !o.email) || o.lastName?.length === 0)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => (!o.name && !o.lastName) || o.email?.length === 0)
  @IsString()
  @IsNotEmpty()
  email: string;
}
