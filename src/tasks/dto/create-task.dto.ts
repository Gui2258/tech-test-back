/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
    @ApiProperty({ description: 'The title of the product' })
    @IsString()
    @MinLength(3)
    content: string;
}
