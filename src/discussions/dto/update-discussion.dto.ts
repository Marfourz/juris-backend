import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscussionDto } from './create-discussion.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateDiscussionDto extends PartialType(CreateDiscussionDto) {
}
