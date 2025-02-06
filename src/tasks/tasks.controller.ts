import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'Task created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({ status: 200, description: 'Return all tasks' })
    findAll() {
        return this.tasksService.findAll();
    }

    @Get(':id/set')
    @ApiOperation({ summary: 'Set task status' })
    @ApiParam({ name: 'id', description: 'Task ID' })
    @ApiResponse({ status: 200, description: 'Task status updated' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    setStatus(@Param('id') id: string) {
        return this.tasksService.setStatus(id);
    }

    @Get(':id/unset')
    @ApiOperation({ summary: 'Unset task status' })
    @ApiParam({ name: 'id', description: 'Task ID' })
    @ApiResponse({ status: 200, description: 'Task status updated' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    unsetStatus(@Param('id') id: string) {
        return this.tasksService.unsetStatus(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a task by ID' })
    @ApiParam({ name: 'id', description: 'Task ID' })
    @ApiResponse({ status: 200, description: 'Return the task' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a task' })
    @ApiParam({ name: 'id', description: 'Task ID' })
    @ApiResponse({ status: 200, description: 'Task updated successfully' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a task' })
    @ApiParam({ name: 'id', description: 'Task ID' })
    @ApiResponse({ status: 200, description: 'Task deleted successfully' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }
}
