import { Type } from 'class-transformer';
import {
  IsUrl,
  IsArray,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { StepDto } from './Step.dto';
import { IngredientDto } from './Ingredient.dto';

export class CreateRecipeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps: StepDto[];
}
