import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('TasksService', () => {
    let service: TasksService;
    let repository: Repository<Task>;
    const validUuid = uuidv4() as string;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: getRepositoryToken(Task),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        repository = module.get<Repository<Task>>(getRepositoryToken(Task));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a task successfully', async () => {
            const createTaskDto: CreateTaskDto = { content: 'Test task' };
            const newTask: Partial<Task> = {
                id: validUuid,
                content: 'Test task',
                checkDone: false,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.create.mockReturnValue(newTask);
            mockRepository.save.mockResolvedValue(newTask);

            const result = await service.create(createTaskDto);
            expect(result).toEqual(newTask);
        });

        it('should handle database errors during creation', async () => {
            const createTaskDto: CreateTaskDto = { content: 'Test task' };
            mockRepository.save.mockRejectedValue(new Error());

            await expect(service.create(createTaskDto)).rejects.toThrow(
                InternalServerErrorException
            );
        });
    });

    describe('findAll', () => {
        it('should return all non-deleted tasks', async () => {
            const expectedTasks: Partial<Task>[] = [
                {
                    id: validUuid,
                    content: 'Test task',
                    checkDone: false,
                    isDeleted: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockRepository.find.mockResolvedValue(expectedTasks);

            const result = await service.findAll();
            expect(result).toEqual(expectedTasks);
        });
    });

    describe('findOne', () => {
        it('should return a task by id', async () => {
            const expectedTask: Partial<Task> = {
                id: validUuid,
                content: 'Test task',
                checkDone: false,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(expectedTask);

            const result = await service.findOne(validUuid);
            expect(result).toEqual(expectedTask);
        });

        it('should throw NotFoundException for non-existent task', async () => {
            const nonExistentUuid = uuidv4();
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(nonExistentUuid)).rejects.toThrow(
                NotFoundException
            );
        });

        it('should throw BadRequestException for invalid UUID', async () => {
            const invalidId = 'not-a-uuid';

            await expect(service.findOne(invalidId)).rejects.toThrow(
                BadRequestException
            );
        });
    });

    describe('update', () => {
        it('should update a task successfully', async () => {
            const updateTaskDto: UpdateTaskDto = { content: 'Updated task' };
            const existingTask: Partial<Task> = {
                id: validUuid,
                content: 'Original task',
                checkDone: false,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updatedTask = {
                ...existingTask,
                ...updateTaskDto,
                updatedAt: expect.any(Date),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(
                existingTask as Task
            );
            mockRepository.save.mockResolvedValue({
                ...existingTask,
                ...updateTaskDto,
                updatedAt: new Date(),
            });

            const result = await service.update(validUuid, updateTaskDto);
            expect(result).toEqual(updatedTask);
        });
    });

    describe('remove', () => {
        it('should mark a task as deleted', async () => {
            const task: Partial<Task> = {
                id: validUuid,
                content: 'Test task',
                isDeleted: false,
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(task as Task);
            mockRepository.save.mockResolvedValue({ ...task, isDeleted: true });

            const result = await service.remove(validUuid);
            expect(result).toEqual({
                message: 'Product marked as deleted successfully',
            });
        });
    });
});
