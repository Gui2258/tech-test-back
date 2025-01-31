import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
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

    @ApiProperty({ description: 'Creation date of the task' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Last modification date of the task' })
    @UpdateDateColumn()
    updatedAt: Date;
}
