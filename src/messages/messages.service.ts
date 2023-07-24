import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageType } from './messages.schema';
import { Model } from 'mongoose';
import { DiscussionsService } from '../discussions/discussions.service';
import { GptService } from '../gpt/gpt.service';
var fs = require('fs');
var randomstring = require('randomstring');

@Injectable()
export class MessagesService {

  constructor(@InjectModel(Message.name) private messageModel : Model<Message>, 
              private discussionService : DiscussionsService,
              private gptService : GptService){}

  async create(createMessageDto: CreateMessageDto, userId : string | null) {
    let discussion
    try{
       discussion = await this.discussionService.findOne(createMessageDto.discussionId)
    }
    catch(error){
      console.log(error)
      throw new BadRequestException('Discussion not exist')
    }

    if(discussion.user._id != userId)
      throw new UnauthorizedException('You dont have permission to send message in this discussion')

    if(createMessageDto.responseToMessageId){
      const oldMessage = await this.messageModel.findById(createMessageDto.responseToMessageId)
      if(!oldMessage)
        throw new BadRequestException('Old message not exist')
    }

    const userMessage = await this.messageModel.create({
      discussion : createMessageDto.discussionId,
      text: createMessageDto.text,
      responseToMsg : createMessageDto.responseToMessageId ? createMessageDto.responseToMessageId : null,
      type : MessageType.USER 
    }) 


    const messages = await this.messageModel.find({discussion : discussion.id})

    const gptMessage  = await this.gptService.sendMessage(messages)

    return this.messageModel.create({
      discussion : createMessageDto.discussionId,
      text: gptMessage,
      responseToMsg : userMessage.id,
      type : MessageType.CHATBOT
    }) 

     
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async findAll(disccussionId: string) {
    const messages = await this.messageModel.find({
      discussion : disccussionId
    })

    return messages
    
  }


  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
