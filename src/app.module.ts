import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, RecipesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
