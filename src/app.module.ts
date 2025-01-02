import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin/admin.controller';
import { GptService } from './gpt/gpt.service';

@Module({
  imports: [
     ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost/juris-db'),
  
  UsersModule, MessagesModule, DiscussionsModule, AuthModule,
 
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '60s' },
  }),
],
  controllers: [AppController, AdminController],
  providers: [AppService, GptService],
})
export class AppModule {}
