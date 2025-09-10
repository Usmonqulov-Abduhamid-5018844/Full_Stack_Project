import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum PaymentStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

export class PaymentCallbackDto {
  @ApiProperty({ example: 'Payme' })
  @IsString()
  provider: string;

  @ApiProperty({ example: 'txn_123456789' })
  @IsString()
  transaction_id: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'success', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ example: 1234 })
  @IsOptional()
  @IsInt()
  card_last4?: number;

  @ApiProperty({ example: 'Humo' })
  @IsOptional()
  @IsString()
  card_brand?: string;

  @ApiProperty({ example: 'tok_1PXxx12345' })
  @IsOptional()
  @IsString()
  card_token?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  doctor_id?: number;

  @ApiProperty({ example: 7 })
  @IsOptional()
  @IsInt()
  patients_id?: number;
}
