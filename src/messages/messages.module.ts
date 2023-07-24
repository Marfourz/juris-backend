import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './messages.schema';
import { DiscussionsModule } from '../discussions/discussions.module';
import { GptService } from '../gpt/gpt.service';

@Module({
  imports:[MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),DiscussionsModule],
  controllers: [MessagesController],
  providers: [MessagesService,GptService]
})
export class MessagesModule {}
