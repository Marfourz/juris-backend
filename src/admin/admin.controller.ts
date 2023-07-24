import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DiscussionsService } from '../discussions/discussions.service';

@Controller('admin')
export class AdminController {

    constructor(private userService : UsersService,private discussionService : DiscussionsService){}

    @Get("stats")
    async stats(){
      return {
        totalUsers : await this.userService.getTotal(),
        totalDiscussions : await this.discussionService.getTotal()
      }
    }


}
