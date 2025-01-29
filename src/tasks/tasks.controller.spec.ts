import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

describe('TasksController', () => {
    let controller: TasksController;
    let service: TasksService;

    const mockTasksService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
                    useValue: mockTasksService,
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
        it('should create a new task', async () => {
            const createTaskDto: CreateTaskDto = {
                content: 'Test Task',
            };

            const expectedResult: Task = {
                checkDone: false,
                isDeleted: false,
                id: '1',
                ...createTaskDto,
            };

            mockTasksService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createTaskDto);
            expect(result).toEqual(expectedResult);
            expect(mockTasksService.create).toHaveBeenCalledWith(createTaskDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of tasks', async () => {
            const expectedTasks: Task[] = [
                {
                    id: '1',
                    content: 'Task 1',
                    checkDone: false,
                    isDeleted: false,
                },
            ];

            mockTasksService.findAll.mockResolvedValue(expectedTasks);

            const result = await controller.findAll();
            expect(result).toEqual(expectedTasks);
            expect(mockTasksService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a single task', async () => {
            const taskId = '1';
            const expectedTask: Task = {
                id: taskId,
                content: 'Task 1',
                checkDone: false,
                isDeleted: false,
            };

            mockTasksService.findOne.mockResolvedValue(expectedTask);

            const result = await controller.findOne(taskId);
            expect(result).toEqual(expectedTask);
            expect(mockTasksService.findOne).toHaveBeenCalledWith(taskId);
        });

        it('should handle not found task', async () => {
            const taskId = '999';
            mockTasksService.findOne.mockResolvedValue(null);

            const result = await controller.findOne(taskId);
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update a task', async () => {
            const taskId = '1';
            const updateTaskDto: UpdateTaskDto = {
                content: 'Updated Task',
            };

            const expectedResult: Task = {
                id: taskId,
                content: 'Updated Task',
                checkDone: false,
                isDeleted: false,
            };

            mockTasksService.update.mockResolvedValue(expectedResult);

            const result = await controller.update(taskId, updateTaskDto);
            expect(result).toEqual(expectedResult);
            expect(mockTasksService.update).toHaveBeenCalledWith(
                taskId,
                updateTaskDto
            );
        });
    });

    describe('remove', () => {
        it('should remove a task', async () => {
            const taskId = '1';
            const expectedResult = { deleted: true };

            mockTasksService.remove.mockResolvedValue(expectedResult);

            const result = await controller.remove(taskId);
            expect(result).toEqual(expectedResult);
            expect(mockTasksService.remove).toHaveBeenCalledWith(taskId);
        });
    });
});
