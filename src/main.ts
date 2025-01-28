import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'http://localhost:3001',
    });

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    );

    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 3000);

    const config = new DocumentBuilder()
        .setTitle('Cuban Enginier Tech Test')
        .setDescription('Backend of the Cuben Enginier Tech Test')
        .setVersion('0.1')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, document);
}
void bootstrap();
