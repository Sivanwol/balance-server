import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [UsersController],
  providers: [],
  exports: [],
})
export class UsersModule {}
