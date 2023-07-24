import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';
import { log } from 'console';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    let user = await this.userModel.findOne({
      username: createUserDto.username,
    });

    if (user)
      throw new HttpException('Nom utilisateur déjà pris', HttpStatus.CONFLICT);

    user = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (user)
      throw new HttpException('Email déjà pris', HttpStatus.CONFLICT);
    return this.userModel.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async findByUsername(username : string){
    return await this.userModel.findOne({
      username,
    });

  }


  async findByUsernameOrEmail(username : string){
    return await this.userModel.findOne( {
      $or: [{
        email : username
      },{
        username : username
      }] ,
    });

  }

  

  findAll() {
    return this.userModel.find().sort({
      createdAt : -1
    });
  }


  getTotal(){
    return this.userModel.count()
  }

  async searchUser(searchData : SearchUserDto){
    const limit = searchData.limit ?? 10
    const skip = searchData.skip ?? 0

    let filter = {}

    if(searchData.search){
      filter = {
        $or: [
          {username : {$regex : ".*" + searchData.search + ".*"}},
          {firstname : {$regex : ".*" + searchData.search + ".*"},},
          { lastname :{$regex : ".*" + searchData.search + ".*"}}
      ]
      }
    }
    
    const total = await this.userModel.find(filter).count()
    
    const users = await this.userModel.find(filter).skip(skip).limit(limit)
    return {
      data: users,
      total: total,
      limit:limit,
      skip: skip
    }
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try{
      const user = await this.userModel.findById(id)
      return this.userModel.findByIdAndUpdate(id, updateUserDto,{new:true,lean:true})
    }catch(error){
      throw  new HttpException("User not found", HttpStatus.NOT_FOUND)
    }
    
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
