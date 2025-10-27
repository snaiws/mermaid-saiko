import { DiagramImage } from './diagram-image.aggregate';
import { ImageFormat } from './image-format.enum';
import { ExportStatus } from './export-status.enum';
import { ExportError } from './export-error.value-object';

describe('DiagramImage Aggregate', () => {
  const testSvg = '<svg><rect width="100" height="100"/></svg>';

  describe('create', () => {
    it('should create a new DiagramImage with PENDING status', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);

      expect(diagramImage.id).toBeDefined();
      expect(diagramImage.sourceSvg).toBe(testSvg);
      expect(diagramImage.format).toBe(ImageFormat.PNG);
      expect(diagramImage.exportStatus).toBe(ExportStatus.PENDING);
      expect(diagramImage.imageData).toBeNull();
      expect(diagramImage.error).toBeNull();
      expect(diagramImage.fileSize).toBe(0);
      expect(diagramImage.createdAt).toBeInstanceOf(Date);
    });

    it('should create with custom options', () => {
      const options = {
        fileName: 'my-diagram',
        width: 800,
        height: 600,
        scale: 2,
      };
      const diagramImage = DiagramImage.create(
        testSvg,
        ImageFormat.PNG,
        options,
      );

      expect(diagramImage.options.fileName).toBe('my-diagram');
      expect(diagramImage.options.width).toBe(800);
      expect(diagramImage.options.height).toBe(600);
      expect(diagramImage.options.scale).toBe(2);
    });

    it('should throw error when SVG is empty', () => {
      expect(() => DiagramImage.create('', ImageFormat.PNG)).toThrow(
        'Source SVG cannot be empty',
      );
    });

    it('should emit ImageExportRequested event', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);
      const events = diagramImage.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('ImageExportRequested');
    });
  });

  describe('markAsExported', () => {
    it('should mark as exported with Buffer data', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);
      const imageData = Buffer.from('fake-png-data');

      diagramImage.markAsExported(imageData);

      expect(diagramImage.exportStatus).toBe(ExportStatus.SUCCESS);
      expect(diagramImage.imageData).toBe(imageData);
      expect(diagramImage.fileSize).toBe(imageData.length);
      expect(diagramImage.error).toBeNull();
    });

    it('should mark as exported with string data (SVG)', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.SVG);
      const svgData = '<svg>exported</svg>';

      diagramImage.markAsExported(svgData);

      expect(diagramImage.exportStatus).toBe(ExportStatus.SUCCESS);
      expect(diagramImage.imageData).toBe(svgData);
      expect(diagramImage.fileSize).toBeGreaterThan(0);
    });

    it('should throw error when image data is empty', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);

      expect(() => diagramImage.markAsExported(null as any)).toThrow(
        'Image data cannot be empty',
      );
    });

    it('should emit ImageExported event', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);
      diagramImage.pullDomainEvents(); // Clear creation event

      diagramImage.markAsExported(Buffer.from('data'));
      const events = diagramImage.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('ImageExported');
    });
  });

  describe('markAsFailed', () => {
    it('should mark as failed with error', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);
      const error = ExportError.create('Export failed');

      diagramImage.markAsFailed(error);

      expect(diagramImage.exportStatus).toBe(ExportStatus.FAILED);
      expect(diagramImage.imageData).toBeNull();
      expect(diagramImage.error).toBe(error);
      expect(diagramImage.fileSize).toBe(0);
    });

    it('should emit ImageExportFailed event', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);
      diagramImage.pullDomainEvents(); // Clear creation event

      const error = ExportError.create('Export failed');
      diagramImage.markAsFailed(error);
      const events = diagramImage.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('ImageExportFailed');
    });
  });

  describe('getImageData', () => {
    it('should return image data when successfully exported', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);
      const imageData = Buffer.from('data');
      diagramImage.markAsExported(imageData);

      expect(diagramImage.getImageData()).toBe(imageData);
    });

    it('should throw error when not successfully exported', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);

      expect(() => diagramImage.getImageData()).toThrow(
        'Image has not been successfully exported',
      );
    });
  });

  describe('getFileName', () => {
    it('should return custom file name with extension', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG, {
        fileName: 'my-diagram',
      });

      expect(diagramImage.getFileName()).toBe('my-diagram.png');
    });

    it('should generate file name with timestamp when no custom name', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.SVG);
      const fileName = diagramImage.getFileName();

      expect(fileName).toMatch(/^diagram-\d+\.svg$/);
    });
  });

  describe('resize', () => {
    it('should resize PNG image and reset to PENDING', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);
      diagramImage.markAsExported(Buffer.from('data'));
      diagramImage.pullDomainEvents(); // Clear previous events

      diagramImage.resize(1024, 768);

      expect(diagramImage.options.width).toBe(1024);
      expect(diagramImage.options.height).toBe(768);
      expect(diagramImage.exportStatus).toBe(ExportStatus.PENDING);
      expect(diagramImage.imageData).toBeNull();
      expect(diagramImage.fileSize).toBe(0);
    });

    it('should throw error when resizing SVG', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.SVG);

      expect(() => diagramImage.resize(1024, 768)).toThrow(
        'Cannot resize SVG format',
      );
    });

    it('should throw error for invalid dimensions', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);

      expect(() => diagramImage.resize(0, 100)).toThrow(
        'Width and height must be greater than 0',
      );
      expect(() => diagramImage.resize(100, -1)).toThrow(
        'Width and height must be greater than 0',
      );
    });

    it('should emit ImageResized event', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);
      diagramImage.pullDomainEvents(); // Clear creation event

      diagramImage.resize(1024, 768);
      const events = diagramImage.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('ImageResized');
    });
  });

  describe('pullDomainEvents', () => {
    it('should return all domain events and clear them', () => {
      const diagramImage = DiagramImage.create(testSvg, ImageFormat.PNG);
      const firstPull = diagramImage.pullDomainEvents();
      const secondPull = diagramImage.pullDomainEvents();

      expect(firstPull).toHaveLength(1);
      expect(secondPull).toHaveLength(0);
    });
  });

  describe('reconstitute', () => {
    it('should reconstruct DiagramImage from existing data', () => {
      const id = 'test-id';
      const imageData = Buffer.from('test-data');
      const createdAt = new Date('2024-01-01');
      const options = { fileName: null, width: null, height: null, scale: 1 };

      const diagramImage = DiagramImage.reconstitute(
        id,
        testSvg,
        ImageFormat.PNG,
        imageData,
        ExportOptions.create(options),
        ExportStatus.SUCCESS,
        null,
        createdAt,
        imageData.length,
      );

      expect(diagramImage.id).toBe(id);
      expect(diagramImage.sourceSvg).toBe(testSvg);
      expect(diagramImage.format).toBe(ImageFormat.PNG);
      expect(diagramImage.imageData).toBe(imageData);
      expect(diagramImage.exportStatus).toBe(ExportStatus.SUCCESS);
      expect(diagramImage.fileSize).toBe(imageData.length);
    });
  });

  describe('Invariants', () => {
    it('should validate SUCCESS status requires image data', () => {
      const options = { fileName: null, width: null, height: null, scale: 1 };

      expect(() => {
        DiagramImage.reconstitute(
          'test-id',
          testSvg,
          ImageFormat.PNG,
          null, // imageData 없음
          ExportOptions.create(options),
          ExportStatus.SUCCESS,
          null,
          new Date(),
          0,
        );
      }).toThrow('SUCCESS status requires image data');
    });

    it('should validate FAILED status requires error', () => {
      const options = { fileName: null, width: null, height: null, scale: 1 };

      expect(() => {
        DiagramImage.reconstitute(
          'test-id',
          testSvg,
          ImageFormat.PNG,
          null,
          ExportOptions.create(options),
          ExportStatus.FAILED,
          null, // Error 없음
          new Date(),
          0,
        );
      }).toThrow('FAILED status requires error');
    });
  });
});

// Import ExportOptions for reconstitute test
import { ExportOptions } from './export-options.value-object';
