import { IsInt, IsString, Min } from 'class-validator';

export class StepDto {
  @IsInt()
  @Min(1)
  order: number;

  @IsString()
  text: string;
}
