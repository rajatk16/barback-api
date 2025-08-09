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

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients?: IngredientDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps?: StepDto[];
}
