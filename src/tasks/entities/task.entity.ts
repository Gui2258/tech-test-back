import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
export class Task {
    @ApiProperty({ description: 'The unique identifier of the task' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Task content' })
    @Column('text')
    content: string;

    @ApiProperty({ description: 'Task status' })
    @Column('bool', { default: false })
    checkDone: boolean;
}
