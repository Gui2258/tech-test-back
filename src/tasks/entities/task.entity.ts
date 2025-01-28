import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
export class Task {
    @ApiProperty({ description: 'The unique identifier of the product' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The title of the product' })
    @Column('text')
    content: string;
}
