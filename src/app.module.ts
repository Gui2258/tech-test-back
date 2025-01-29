import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            ssl: process.env.STAGE === 'prod',
            extra:
                process.env.STAGE === 'prod'
                    ? { rejectUnauthorized: false }
                    : null,
            type: 'postgres',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? +process.env.DB_PORT : 5433,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            autoLoadEntities: true,
            synchronize: true, //Sincroniza los cambios a las entidades automaticamente en la db
        }),
        TasksModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
