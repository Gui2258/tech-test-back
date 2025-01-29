import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
    let controller: TasksController;
    let service: TasksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TasksController>(TasksController);
        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a task', async () => {
            const createTaskDto: CreateTaskDto = {
                title: 'Test task',
                description: 'Test description',
            };
            const result = { id: '1', ...createTaskDto };
            jest.spyOn(service, 'create').mockImplementation(
                async () => result
            );

            expect(await controller.create(createTaskDto)).toBe(result);
        });
    });

    describe('findAll', () => {
        it('should return an array of tasks', async () => {
            const result = [
                {
                    id: '1',
                    title: 'Test task',
                    description: 'Test description',
                },
            ];
            jest.spyOn(service, 'findAll').mockImplementation(
                async () => result
            );

            expect(await controller.findAll()).toBe(result);
        });
    });

    describe('findOne', () => {
        it('should return a single task', async () => {
            const result = {
                id: '1',
                title: 'Test task',
                description: 'Test description',
            };
            jest.spyOn(service, 'findOne').mockImplementation(
                async () => result
            );

            expect(await controller.findOne('1')).toBe(result);
        });
    });

    describe('update', () => {
        it('should update a task', async () => {
            const updateTaskDto: UpdateTaskDto = {
                title: 'Updated task',
                description: 'Updated description',
            };
            const result = { id: '1', ...updateTaskDto };
            jest.spyOn(service, 'update').mockImplementation(
                async () => result
            );

            expect(await controller.update('1', updateTaskDto)).toBe(result);
        });
    });

    describe('remove', () => {
        it('should remove a task', async () => {
            const result = {
                id: '1',
                title: 'Test task',
                description: 'Test description',
            };
            jest.spyOn(service, 'remove').mockImplementation(
                async () => result
            );

            expect(await controller.remove('1')).toBe(result);
        });
    });
});
