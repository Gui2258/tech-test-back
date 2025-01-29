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

describe('TasksService', () => {
    let service: TasksService;
    let repository: Repository<Task>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: getRepositoryToken(Task),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        repository = module.get<Repository<Task>>(getRepositoryToken(Task));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a task', async () => {
            const createTaskDto: CreateTaskDto = { content: 'Test task' };
            const task = { id: '1', content: 'Test task' };

            jest.spyOn(repository, 'create').mockReturnValue(task as Task);
            jest.spyOn(repository, 'save').mockResolvedValue(task as Task);

            expect(await service.create(createTaskDto)).toEqual(task);
        });

        it('should handle database exceptions', async () => {
            const createTaskDto: CreateTaskDto = { content: 'Test task' };

            jest.spyOn(repository, 'save').mockRejectedValue(new Error());

            await expect(service.create(createTaskDto)).rejects.toThrow(
                InternalServerErrorException
            );
        });
    });

    describe('findAll', () => {
        it('should return an array of tasks', async () => {
            const tasks = [{ id: '1', content: 'Test task' }];

            jest.spyOn(repository, 'find').mockResolvedValue(tasks as Task[]);

            expect(await service.findAll()).toEqual(tasks);
        });
    });

    describe('findOne', () => {
        it('should return a task', async () => {
            const task = { id: '1', content: 'Test task' };

            jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);

            expect(await service.findOne('1')).toEqual(task);
        });

        it('should throw NotFoundException if task not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(service.findOne('1')).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('update', () => {
        it('should update a task', async () => {
            const updateTaskDto: UpdateTaskDto = { content: 'Updated task' };
            const task = { id: '1', content: 'Test task' };

            jest.spyOn(service, 'findOne').mockResolvedValue(task as Task);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...task,
                ...updateTaskDto,
            } as Task);

            expect(await service.update('1', updateTaskDto)).toEqual({
                ...task,
                ...updateTaskDto,
            });
        });

        it('should handle database exceptions', async () => {
            const updateTaskDto: UpdateTaskDto = { content: 'Updated task' };
            const task = { id: '1', content: 'Test task' };

            jest.spyOn(service, 'findOne').mockResolvedValue(task as Task);
            jest.spyOn(repository, 'save').mockRejectedValue({ code: '23505' });

            await expect(service.update('1', updateTaskDto)).rejects.toThrow(
                BadRequestException
            );
        });
    });

    describe('remove', () => {
        it('should mark a task as deleted', async () => {
            const task = { id: '1', content: 'Test task', isDeleted: false };

            jest.spyOn(service, 'findOne').mockResolvedValue(task as Task);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...task,
                isDeleted: true,
            } as Task);

            expect(await service.remove('1')).toEqual({
                message: 'Product marked as deleted successfully',
            });
        });
    });
});
