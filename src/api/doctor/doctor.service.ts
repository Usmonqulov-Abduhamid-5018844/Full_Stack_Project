import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { OtpDoctorDto } from './dto/otp-doctor.dto';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { FileService } from '../file/file.service';
import { DoctorFileService } from '../doctor_file/doctor_file.service';
import { DoctorIdDto } from './dto/doctor_id.dto';
import { cretedDoctorDto } from './dto/creted-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService,
    private readonly Otp: OtpGenerate,
    private readonly fileService: FileService,
    
  ){}

  async create(createDoctorDto: cretedDoctorDto) {
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
  }, doctor: DoctorIdDto){
    const savetFiles: string[] = []
    try {
      const data = await this.prisma.doctors.findFirst({where: {id: doctor.id}})
      if(!data){
        throw new NotFoundException("doctot id not fount")
      }

      const doctor_files = await this.prisma.doctor_file.findFirst({where: {doctor_id: doctor.id}})
      const updateFiles: any = {}

      if(files.diplom_file?.length){
        const file = await this.fileService.createFile(files.diplom_file[0])
        savetFiles.push(file)
        updateFiles.diplom_file = file
        if(doctor_files && doctor_files.diplom_file){
            await this.fileService.deleteFile(doctor_files.diplom_file)
        }

      }
      if(files.passport_file?.length){
        const file = await this.fileService.createFile(files.passport_file[0])
        savetFiles.push(file)
        updateFiles.passport_file = file
         if(doctor_files && doctor_files.passport_file){
            await this.fileService.deleteFile(doctor_files.passport_file)
        }
      }
      if(files.sertifikat_file?.length){
        const file = await this.fileService.createFile(files.sertifikat_file[0])
        savetFiles.push(file)
        updateFiles.sertifikat_file = file
         if(doctor_files && doctor_files.sertifikat_file){
            await this.fileService.deleteFile(doctor_files.sertifikat_file)
        }
      }
      if(files.tibiy_varaqa_file?.length){
        const file = await this.fileService.createFile(files.tibiy_varaqa_file[0])
        savetFiles.push(file)
        updateFiles.tibiy_varaqa_file = file
         if(doctor_files && doctor_files.tibiy_varaqa_file){
            await this.fileService.deleteFile(doctor_files.tibiy_varaqa_file)
        }
      }
      if(files.yatt_file?.length){
        const file = await this.fileService.createFile(files.yatt_file[0])
        savetFiles.push(file)
        updateFiles.yatt_file = file
         if(doctor_files && doctor_files.yatt_file){
            await this.fileService.deleteFile(doctor_files.yatt_file)
        }
      }
      if(doctor_files){
          const updateDoctorFile = await this.prisma.doctor_file.update({where: {id: doctor_files.id}, data: {...updateFiles}})
           return successRes(updateDoctorFile, 200, "Malumotlaringiz muvofiyaqatliy O'zgartirildi. Admin 24 soat ichida ko'rib chiqadi va sizga xabar beriladi.")
      }
      else{
        const cretDoctorfile = await this.prisma.doctor_file.create({data: {...updateFiles,doctor_id: doctor.id}})
        return successRes(cretDoctorfile, 201, "Malumotlaringiz muvofiyaqatliy saqlandi. Admin 24 soat ichida ko'rib chiqadi va sizga xabar beriladi.")
      }
    } catch (error) {
      for(const f of savetFiles){
        await this.fileService.deleteFile(f).catch(()=> {})
      }
      return ErrorHender(error)
    }
 }

 async login(data: cretedDoctorDto){
    try {
      const doctor = await this.prisma.doctors.findUnique({where: {phone: data.phone}})
      
    } catch (error) {
      return ErrorHender(error)
    }
 }
  async findAll() {
    try {
      const data = await this.prisma.doctors.findMany({include: {Doctor_file:true}})
      if(!data.length){
        throw new NotFoundException()
      }
      return successRes(data) 
    } catch (error) {
      return ErrorHender(error)
    }
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
