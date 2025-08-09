import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/CreateRecipe.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UpdateRecipeDto } from './dto/UpdateRecipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() dto: CreateRecipeDto, @Req() req: { user: { id: string } }) {
    return this.recipesService.create({
      name: dto.name,
      description: dto.description,
      imageUrl: dto.imageUrl,
      ingredients: {
        create: dto.ingredients,
      },
      steps: {
        create: dto.steps,
      },
      createdBy: {
        connect: {
          id: req.user.id,
        },
      },
    });
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecipeDto) {
    const updateData: Prisma.RecipeUpdateInput = {
      name: dto.name,
      description: dto.description,
      imageUrl: dto.imageUrl,
    };

    if (dto.ingredients) {
      updateData.ingredients = {
        deleteMany: {},
        create: dto.ingredients,
      };
    }

    if (dto.steps) {
      updateData.steps = {
        deleteMany: {},
        create: dto.steps,
      };
    }

    return this.recipesService.update(id, updateData);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipesService.delete(id);
  }
}
