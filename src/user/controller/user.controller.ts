import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // admin
 @hasRoles('Admin')
 @UseGuards(JwtAuthGuard, RolesGuard)
 
 
  // user post request
  @Post()
  create(@Body() user: User): Observable<User | object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      })
    )
  }

  
  //  get one user request
  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }
  // @hasRoles('Admin')
  // @UseGuards(JwtAuthGuard, RolesGuard)
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
