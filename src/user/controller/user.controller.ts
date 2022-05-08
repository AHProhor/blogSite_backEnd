import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserRole } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  
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
  // get all user request
  @Get()
  index( @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({page, limit, route: 'http://localhost:3000/users'});
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

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id:string, @Body()user:User) : Observable<User>{
    return this.userService.updateRoleOfUser(Number(id), user);
  }
}
