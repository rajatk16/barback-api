import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.RecipeCreateInput) {
    return this.prisma.recipe.create({
      data,
      include: {
        steps: true,
        ingredients: true,
        ratings: true,
        favorites: true,
        createdBy: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.recipe.findMany({
      include: {
        steps: true,
        ratings: true,
        favorites: true,
        ingredients: true,
        createdBy: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async findById(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        steps: true,
        ratings: true,
        favorites: true,
        ingredients: true,
        createdBy: { select: { id: true, username: true, email: true } },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found.`);
    }

    return recipe;
  }

  async update(id: string, data: Prisma.RecipeUpdateInput) {
    return this.prisma.recipe.update({
      where: { id },
      data,
      include: {
        steps: true,
        ratings: true,
        favorites: true,
        ingredients: true,
        createdBy: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.ingredient.deleteMany({ where: { recipeId: id } });
      await tx.step.deleteMany({ where: { recipeId: id } });
      await tx.rating.deleteMany({ where: { recipeId: id } });
      await tx.favorite.deleteMany({ where: { recipeId: id } });

      // Then delete the recipe
      return tx.recipe.delete({ where: { id } });
    });
  }
}
