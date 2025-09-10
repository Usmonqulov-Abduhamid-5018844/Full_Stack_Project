import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentCallbackDto } from './dto/create-payment.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({
    summary:
      'Payment provider callback (foydalanuvchi yubormaydi, provider avtomatik yuboradi)',
  })
  @Post('/callback')
  create(@Body() paymentCallbackDto: PaymentCallbackDto) {
    return this.paymentsService.create(paymentCallbackDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.paymentsService.findAll(req);
  }
}
