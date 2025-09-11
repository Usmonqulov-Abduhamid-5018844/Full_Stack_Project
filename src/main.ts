// import AppService from './api/app.service';

// void AppService.main();




import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './api/app.module';
import { AllExceptionsFilter } from './infrostructure/exceoption/AllErrorFilter';
import { NotFoundFilter } from './infrostructure/exceoption/NotFountFilter';

const Port = Number(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter(), new NotFoundFilter());
  app.enableCors({ origin: '*' });

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
    console.log(`Server running on port ${Port}`);
  });
}
bootstrap();

