import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ExportOptionsDto } from './export-options.dto';

export class ExportSvgRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'mermaidCode는 필수입니다' })
  mermaidCode: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ExportOptionsDto)
  options?: ExportOptionsDto;
}
