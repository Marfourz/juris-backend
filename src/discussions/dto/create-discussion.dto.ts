import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty } from "class-validator"



export class CreateDiscussionDto {

    @ApiProperty()
    name : string
}
