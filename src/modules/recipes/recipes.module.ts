import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [RecipesService, PrismaService],
  controllers: [RecipesController],
})
export class RecipesModule {}
