import { HttpStatus, Injectable, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/infrostructure/exceoption/AllErrorFilter';
import { NotFoundFilter } from 'src/infrostructure/exceoption/NotFountFilter';

const Port = Number(process.env.PORT) || 4000;

@Injectable()
export default class AppService {
  public static async main(): Promise<void> {
    let app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new AllExceptionsFilter(), new NotFoundFilter());
    app.enableCors({
      origin: '*',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Full Stack Loiha')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addSecurityRequirements('bearer', ['bearer'])
      .addBearerAuth()
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    await app.listen(Port, '0.0.0.0', () => {
      console.log(`server running on port ${Port}`);
    });
  }
}
