import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // user post request
  @Post()
  create(@Body() user: User): Observable<User> {
    return this.userService.create(user);
  }

  //  get one user request
  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }

  // get all user request
  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  //   Delete one user request
  @Delete(':id')
  deleteone(@Param('id') id: string): Observable<User> {
    return this.userService.deleteOne(Number(id));
  }

  // update user data request
  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }
}
