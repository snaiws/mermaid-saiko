import { ExportPngUseCase } from './export-png.use-case';
import { ExportPngCommand } from './export-png.command';
import { IDiagramImageRepository } from '../../../domain/export/diagram-image.repository.interface';
import { IImageConverter } from '../../../domain/export/image-converter.interface';
import { IMermaidRenderer } from '../../../domain/rendering/mermaid-renderer.interface';
import { DomainEventPublisherService } from '../../../infrastructure/events/domain-event-publisher.service';
import { DiagramImage } from '../../../domain/export/diagram-image.aggregate';
import { ExportStatus } from '../../../domain/export/export-status.enum';
import { ImageFormat } from '../../../domain/export/image-format.enum';

describe('ExportPngUseCase (Integration)', () => {
  let useCase: ExportPngUseCase;
  let mockRepository: jest.Mocked<IDiagramImageRepository>;
  let mockRenderer: jest.Mocked<IMermaidRenderer>;
  let mockConverter: jest.Mocked<IImageConverter>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherService>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockRenderer = {
      render: jest.fn(),
    } as any;

    mockConverter = {
      convert: jest.fn(),
    } as any;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    } as any;

    // UseCase 직접 생성
    useCase = new ExportPngUseCase(
      mockRepository,
      mockRenderer,
      mockConverter,
      mockEventPublisher,
    );
  });

  describe('execute - success case', () => {
    it('should export PNG successfully', async () => {
      // Given
      const mermaidCode = 'graph TD\n  A-->B';
      const svg = '<svg>test</svg>';
      const pngBuffer = Buffer.from('fake-png-data');
      const command = new ExportPngCommand(mermaidCode, 800, 600, '#FFFFFF');

      mockRenderer.render.mockResolvedValue(svg);
      mockConverter.convert.mockResolvedValue(pngBuffer);
      mockRepository.save.mockResolvedValue(undefined);

      // When
      const result = await useCase.execute(command);

      // Then
      expect(result).toBeDefined();
      expect(result.imageId).toBeDefined();
      expect(result.imageData).toBe(pngBuffer);
      expect(result.format).toBe(ImageFormat.PNG);
      expect(result.fileSize).toBe(pngBuffer.length);
      expect(result.fileName).toMatch(/\.png$/);

      // Verify interactions
      expect(mockRenderer.render).toHaveBeenCalledWith(mermaidCode);
      expect(mockConverter.convert).toHaveBeenCalledWith(
        svg,
        ImageFormat.PNG,
        {
          width: 800,
          height: 600,
          backgroundColor: '#FFFFFF',
        },
      );
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventPublisher.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should save diagram image with SUCCESS status', async () => {
      // Given
      const command = new ExportPngCommand('graph TD\n  A-->B', 800, 600);
      mockRenderer.render.mockResolvedValue('<svg>test</svg>');
      mockConverter.convert.mockResolvedValue(Buffer.from('data'));

      // When
      await useCase.execute(command);

      // Then
      const savedImage = mockRepository.save.mock.calls[0][0] as DiagramImage;
      expect(savedImage.exportStatus).toBe(ExportStatus.SUCCESS);
      expect(savedImage.format).toBe(ImageFormat.PNG);
      expect(savedImage.imageData).toBeDefined();
    });

    it('should publish ImageExportRequested and ImageExported events', async () => {
      // Given
      const command = new ExportPngCommand('graph TD\n  A-->B');
      mockRenderer.render.mockResolvedValue('<svg>test</svg>');
      mockConverter.convert.mockResolvedValue(Buffer.from('data'));

      // When
      await useCase.execute(command);

      // Then
      expect(mockEventPublisher.publishAll).toHaveBeenCalled();
      const publishedEvents = mockEventPublisher.publishAll.mock.calls[0][0];
      expect(publishedEvents.length).toBeGreaterThanOrEqual(2);
      expect(publishedEvents[0].eventType).toBe('ImageExportRequested');
      expect(publishedEvents[1].eventType).toBe('ImageExported');
    });
  });

  describe('execute - failure case', () => {
    it('should throw error when rendering fails', async () => {
      // Given
      const command = new ExportPngCommand('invalid code');
      const renderError = new Error('Mermaid syntax error');

      mockRenderer.render.mockRejectedValue(renderError);

      // When & Then
      await expect(useCase.execute(command)).rejects.toThrow(
        'Mermaid syntax error',
      );
    });

    it('should throw error when image conversion fails', async () => {
      // Given
      const command = new ExportPngCommand('graph TD\n  A-->B');
      const conversionError = new Error('Image conversion failed');

      mockRenderer.render.mockResolvedValue('<svg>test</svg>');
      mockConverter.convert.mockRejectedValue(conversionError);

      // When & Then
      await expect(useCase.execute(command)).rejects.toThrow(
        'Image conversion failed',
      );
    });
  });

  describe('options handling', () => {
    it('should handle custom width and height', async () => {
      // Given
      const command = new ExportPngCommand('graph TD\n  A-->B', 1920, 1080);
      mockRenderer.render.mockResolvedValue('<svg>test</svg>');
      mockConverter.convert.mockResolvedValue(Buffer.from('data'));

      // When
      await useCase.execute(command);

      // Then
      expect(mockConverter.convert).toHaveBeenCalledWith(
        '<svg>test</svg>',
        ImageFormat.PNG,
        expect.objectContaining({
          width: 1920,
          height: 1080,
        }),
      );
    });

    it('should handle background color option', async () => {
      // Given
      const command = new ExportPngCommand(
        'graph TD\n  A-->B',
        800,
        600,
        '#000000',
      );
      mockRenderer.render.mockResolvedValue('<svg>test</svg>');
      mockConverter.convert.mockResolvedValue(Buffer.from('data'));

      // When
      await useCase.execute(command);

      // Then
      expect(mockConverter.convert).toHaveBeenCalledWith(
        '<svg>test</svg>',
        ImageFormat.PNG,
        expect.objectContaining({
          backgroundColor: '#000000',
        }),
      );
    });
  });
});
