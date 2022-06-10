import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserController } from './users.controller';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [],
})
export class UsersModule {}
