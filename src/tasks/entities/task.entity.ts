import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
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

    @ApiProperty({ description: 'If the task is deleted' })
    @Column('bool', { default: false })
    isDeleted: boolean;
}
