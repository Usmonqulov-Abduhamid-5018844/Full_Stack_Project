import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { OtpDoctorDto } from './dto/otp-doctor.dto';
import { successRes } from 'src/infrostructure/utils/succesResponse';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService,
    private readonly Otp: OtpGenerate
  ){}

  async create(createDoctorDto: LoginDoctorDto) {
    const { phone} = createDoctorDto
    try {
      const data = await this.prisma.doctors.findFirst({where: {phone}})
      if(data){
        throw new ConflictException("Alredy exists")
      }
      let otp = this.Otp.Generate(phone)
      return {otp, message: "otp orqaliy shaxsingizni tasdiqlayng."}
    } catch (error) {
      return ErrorHender(error)
    }
  }

 async verify(Otpdata: OtpDoctorDto){
    const {phone,otp} = Otpdata
    try {
      if(this.Otp.verify(phone, otp)){
          const data = await this.prisma.doctors.create({data: {phone}})
          return successRes(data, 201)
      }
      else{
        throw new BadRequestException("Otp expirns")
      }
    } catch (error) {
      console.log(error);
      
      return ErrorHender(error)
      
    }
 }
 async add_files(  files: {
    passport_file?: Express.Multer.File[],
    diplom_file?: Express.Multer.File[],
    yatt_file?: Express.Multer.File[],
    sertifikat_file?: Express.Multer.File[],
    tibiy_varaqa_file?: Express.Multer.File[],
  }, id: number){
    try {
      const data = await this.prisma.doctors.findFirst({where: {id}})
      if(!data){
        throw new NotFoundException("doctot id not fount")
      }
      
    } catch (error) {
      return ErrorHender(error)
    }
 }

  findAll() {
    return `This action returns all doctor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
