import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    database: "e-khata",
    entities: [User],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([User]), AuthModule, UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule { }