import {
  Get,
  Req,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { JwtGuard } from '../../guards/jwt.guard';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/CreateRecipe.dto';
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
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('createdById') createdById?: string,
  ) {
    return this.recipesService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      search,
      createdById,
    });
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
