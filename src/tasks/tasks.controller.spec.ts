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
            providers: [TasksService],
        }).compile();

        controller = module.get<TasksController>(TasksController);
        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a task', async () => {
            const createTaskDto: CreateTaskDto = { content: 'Test task' };
            const result = { id: '1', content: 'Test task' };

            jest.spyOn(service, 'create').mockResolvedValue(result);

            expect(await controller.create(createTaskDto)).toEqual(result);
        });
    });

    describe('findAll', () => {
        it('should return an array of tasks', async () => {
            const result = [{ id: '1', content: 'Test task' }];

            jest.spyOn(service, 'findAll').mockResolvedValue(result);

            expect(await controller.findAll()).toEqual(result);
        });
    });

    describe('findOne', () => {
        it('should return a single task', async () => {
            const result = { id: '1', content: 'Test task' };

            jest.spyOn(service, 'findOne').mockResolvedValue(result);

            expect(await controller.findOne('1')).toEqual(result);
        });
    });

    describe('update', () => {
        it('should update a task', async () => {
            const updateTaskDto: UpdateTaskDto = { content: 'Updated task' };
            const result = { id: '1', content: 'Updated task' };

            jest.spyOn(service, 'update').mockResolvedValue(result);

            expect(await controller.update('1', updateTaskDto)).toEqual(result);
        });
    });

    describe('remove', () => {
        it('should remove a task', async () => {
            const result = { id: '1', content: 'Test task' };

            jest.spyOn(service, 'remove').mockResolvedValue(result);

            expect(await controller.remove('1')).toEqual(result);
        });
    });
});
