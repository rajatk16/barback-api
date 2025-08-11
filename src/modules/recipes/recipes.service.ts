import { Prisma } from '@prisma/client';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    createdById?: string;
  }) {
    const { skip, take, search, createdById } = params;
    const where: Prisma.RecipeWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                {
                  ingredients: {
                    some: { name: { contains: search, mode: 'insensitive' } },
                  },
                },
              ],
            }
          : {},
        createdById ? { createdById } : {},
      ],
    };

    const [total, recipes] = await this.prisma.$transaction([
      this.prisma.recipe.count({ where }),
      this.prisma.recipe.findMany({
        skip,
        take,
        where,
        include: {
          steps: true,
          ratings: true,
          favorites: true,
          ingredients: true,
          createdBy: { select: { id: true, username: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, data: recipes };
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

  async update(id: string, data: Prisma.RecipeUpdateInput, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });

    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found.`);
    }

    if (recipe.createdById !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

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

  async delete(id: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });

    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found.`);
    }

    if (recipe.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

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
