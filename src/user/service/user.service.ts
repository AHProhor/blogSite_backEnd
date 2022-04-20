import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  //   create a new user
  create(user: User): Observable<User> {
    return from(this.userRepository.save(user));
  }

  //   find all the user
  findAll(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  //   find a single user

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ id }));
  }

  // Delete a user
  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  //   Update a user Data
  updateOne(id: number, user: User): Observable<any> {
    return from(this.userRepository.update(id, user));
  }
}
