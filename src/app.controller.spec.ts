import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
        appService = app.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(appController).toBeDefined();
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });

        it('should call AppService', () => {
            const getHelloSpy = jest
                .spyOn(appService, 'getHello')
                .mockReturnValue('Hello World!');
            appController.getHello();
            expect(getHelloSpy).toHaveBeenCalled();
        });
    });
});
