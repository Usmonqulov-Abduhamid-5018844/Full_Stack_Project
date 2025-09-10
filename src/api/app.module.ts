import { Controller, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DoctorModule } from './doctor/doctor.module';
import { AdminModule } from './admin/admin.module';
import { PatientsModule } from './patients/patients.module';
import { TibbiyKorikModule } from './tibbiy_korik/tibbiy_korik.module';
import { DoctorServicesModule } from './doctor_services/doctor_services.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PaymentsModule } from './payments/payments.module';
import { CommentsModule } from './comments/comments.module';
import { ServiceTypeModule } from './service_type/service_type.module';
import { WelletModule } from './wellet/wellet.module';
import { SpecializationModule } from './specialization/specialization.module';
import { DoctorFileModule } from './doctor_file/doctor_file.module';
import { DoctorSchedulesModule } from './doctor_schedules/doctor_schedules.module';
import { AppController } from './app.controller';
import { PatientsCardModule } from './patients_card/patients_card.module';
import { DoctorCardModule } from './doctor_card/doctor_card.module';
import { DoctorSpecializationModule } from './doctor_specialization/doctor_specialization.module';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { FileDeleteModule } from './file_delete/file_delete.module';
import { MeModule } from './me/me.module';
import { RefreshTokenModule } from './refresh_token/refresh_token.module';

@Module({
  controllers: [AppController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', '..', 'uplout'),
      serveRoot: '/uplout',
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    PrismaModule,
    DoctorModule,
    FileModule,
    AdminModule,
    PatientsModule,
    TibbiyKorikModule,
    DoctorServicesModule,
    AppointmentsModule,
    PaymentsModule,
    CommentsModule,
    ServiceTypeModule,
    WelletModule,
    SpecializationModule,
    DoctorFileModule,
    DoctorSchedulesModule,
    PatientsCardModule,
    DoctorCardModule,
    DoctorSpecializationModule,
    FileDeleteModule,
    MeModule,
    RefreshTokenModule,
  ],
})
export class AppModule {}
