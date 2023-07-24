import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { DiscussionAction, DiscussionType } from './discussions.types';
import { Discussion, DiscussionDocument } from './discussions.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { FindDiscussionDto } from './dto/find-discussion.dto';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    private userService: UsersService,
  ) {}

  async create(createDiscussionDto: CreateDiscussionDto, userId: string) {
    const discussion = this.discussionModel.create({
      name : createDiscussionDto.name,
      user: userId
    });

    return discussion;
  }

  findByUser(params : FindDiscussionDto, userId : string) {

    const filters = {}

    if(params.tag)
      filters['tag'] = params.tag

    return this.discussionModel.find({...filters, 'user': userId})
  }

  findAll() {

    return this.discussionModel.find({})
  }

  getTotal(){
    return this.discussionModel.count()
  }

  findOne(id: string) {
    return this.discussionModel.findOne({_id:id}).populate('user')
  }


  async update(id: string, updateDiscussionDto: UpdateDiscussionDto,userId:string) {
      return await this.discussionModel.findByIdAndUpdate({_id:id}, updateDiscussionDto,{new: true})
  }

  async remove(id: string, userId : string) {
      const discussion = await this.discussionModel.findById(id)
      if(!discussion)
        throw new NotFoundException('Discussion not found')
      return this.discussionModel.deleteOne({_id: id})
  }
}
