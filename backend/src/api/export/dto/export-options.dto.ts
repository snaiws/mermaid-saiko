import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class ExportOptionsDto {
  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  width?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  scale?: number;

  @IsOptional()
  @IsString()
  backgroundColor?: string;
}
