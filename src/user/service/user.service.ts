import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  //   create a new user
  create(user: User): Observable<User> {
    return this.authService.hasPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.userName = user.userName;
        newUser.email = user.email;
        newUser.password = passwordHash;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
  }

  //   find all the user
  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (v) {
          delete v.password;
        });
        return users;
      }),
    );
  }

  //   find a single user

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        const { password, ...result } = user;
        return result;
      }),
    );
  }

  // Delete a user
  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  //   Update a user Data
  updateOne(id: number, user: User): Observable<any> {
    delete user.email;
    delete user.password;

    return from(this.userRepository.update(id, user));
  }

  login(user: User): Observable<string> {
    return this.validatedUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService
            .generateJWT(user)
            .pipe(map((jwt: string) => jwt));
        } else {
          return 'worng Credentials';
        }
      }),
    );
  }

  validatedUser(email: string, password: string): Observable<User> {
    return this.findByMail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePassword(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }

  findByMail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ email }));
  }
}
