import { RenderingError } from './rendering-error.value-object';

describe('RenderingError Value Object', () => {
  describe('create', () => {
    it('should create error with message only', () => {
      const error = RenderingError.create('Syntax error');

      expect(error.message).toBe('Syntax error');
      expect(error.line).toBeNull();
      expect(error.column).toBeNull();
    });

    it('should create error with line number', () => {
      const error = RenderingError.create('Syntax error', 5);

      expect(error.message).toBe('Syntax error');
      expect(error.line).toBe(5);
      expect(error.column).toBeNull();
    });

    it('should create error with line and column', () => {
      const error = RenderingError.create('Syntax error', 5, 10);

      expect(error.message).toBe('Syntax error');
      expect(error.line).toBe(5);
      expect(error.column).toBe(10);
    });

    it('should trim whitespace from message', () => {
      const error = RenderingError.create('  Syntax error  ');

      expect(error.message).toBe('Syntax error');
    });

    it('should throw error when message is empty', () => {
      expect(() => RenderingError.create('')).toThrow(
        'Error message cannot be empty',
      );
    });

    it('should throw error when message is only whitespace', () => {
      expect(() => RenderingError.create('   ')).toThrow(
        'Error message cannot be empty',
      );
    });
  });

  describe('toString', () => {
    it('should format message only', () => {
      const error = RenderingError.create('Syntax error');

      expect(error.toString()).toBe('Syntax error');
    });

    it('should format with line number', () => {
      const error = RenderingError.create('Syntax error', 5);

      expect(error.toString()).toBe('Syntax error (Line 5)');
    });

    it('should format with line and column', () => {
      const error = RenderingError.create('Syntax error', 5, 10);

      expect(error.toString()).toBe('Syntax error (Line 5, Column 10)');
    });
  });
});
