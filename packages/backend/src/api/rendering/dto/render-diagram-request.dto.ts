import { IsString, IsNotEmpty } from 'class-validator';

export class RenderDiagramRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'mermaidCode는 필수입니다' })
  mermaidCode: string;
}
