import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('KupiPodariDay API')
    .setDescription('API для сервиса коллективных подарков')
    .setVersion('1.0')
    .addTag('users', 'Операции с пользователями')
    .addTag('wishes', 'Операции с желаниями')
    .addTag('wishlists', 'Операции со списками желаний')
    .addTag('offers', 'Операции с предложениями скинуться')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
