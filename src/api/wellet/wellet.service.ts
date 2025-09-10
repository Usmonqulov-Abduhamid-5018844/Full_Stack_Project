import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { Request } from 'express';
import { ERols } from 'src/common/enum';
import { successRes } from 'src/infrostructure/utils/succesResponse';

@Injectable()
export class WelletService {
  constructor(private readonly prisma: PrismaService){}
  
  async findOne(id: number, req: Request) {
    const user = req["user"]
    try {
      const data = await this.prisma.wellet.findUnique({where: {id}})
      if(!data){
        throw new NotFoundException("Bunday hamyon mavjud emas")
      }
      if(data.doctor_id !== user.id && user.role !== ERols.ADMIN && user.role !== ERols.SUPPER_ADMIN ){
        throw new ForbiddenException(`Sizda bu hamyonni ko'rish huquqi yo'q`);
      }
      return successRes({...data, balance: data.balance.toNumber()})
    } catch (error) {
      return ErrorHender(error)
    }
  }
}
