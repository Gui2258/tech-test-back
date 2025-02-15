/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>
    ) {}
    async create(createTaskDto: CreateTaskDto) {
        console.log('Creating task');
        const { content } = createTaskDto;
        try {
            const task = this.taskRepository.create({
                content: content,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await this.taskRepository.save(task);

            return task;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    findAll() {
        return this.taskRepository.find({
            where: { checkDone: false, isDeleted: false },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findOne(id: string) {
        let task: Task | null;
        if (isUUID(id)) {
            task = await this.taskRepository.findOne({
                where: { id: id, isDeleted: false },
            });
        } else {
            throw new BadRequestException(`Invalid UUID: ${id}`);
        }

        if (!task) throw new NotFoundException(`Product with ${id} not found`);

        return task;
    }

    async update(id: string, updateTaskDto: UpdateTaskDto) {
        const task = await this.findOne(id);

        const updatedTask = Object.assign(task, {
            ...updateTaskDto,
            updatedAt: new Date(),
        });

        try {
            await this.taskRepository.save(updatedTask);
            return updatedTask;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async remove(id: string) {
        const task = await this.findOne(id);
        task.isDeleted = true;
        task.updatedAt = new Date();
        await this.taskRepository.save(task);
        return { message: 'Product marked as deleted successfully' };
    }

    async setStatus(id: string) {
        const task = await this.findOne(id);
        task.checkDone = true;
        task.updatedAt = new Date();
        await this.taskRepository.save(task);
        return task;
    }

    async unsetStatus(id: string) {
        const task = await this.findOne(id);
        task.checkDone = false;
        task.updatedAt = new Date();
        await this.taskRepository.save(task);
        return task;
    }

    private handleDBExceptions(error: any) {
        if (error.code === '23505') throw new BadRequestException(error.detail);
        if (error.status === 404)
            throw new BadRequestException('Category not found');
        if (error.status === 400)
            throw new BadRequestException('Solicitud incorrecta');
        throw new InternalServerErrorException(
            'Unexpected error, check server logs'
        );
    }
}
