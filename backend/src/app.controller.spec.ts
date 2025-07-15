import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getHello: jest.fn(),
    runSeeder: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('should return welcome message', () => {
      // Arrange
      mockAppService.getHello.mockReturnValue(
        'Welcome to the backend service!',
      );

      // Act
      const result = appController.getHello();

      // Assert
      expect(mockAppService.getHello).toHaveBeenCalled();
      expect(result).toBe('Welcome to the backend service!');
    });
  });

  describe('seeder', () => {
    it('should run seeder', async () => {
      // Arrange
      const expectedResult = 'Seeder completed successfully';
      mockAppService.runSeeder.mockResolvedValue(expectedResult);

      // Act
      const result = await appController.runSeeder();

      // Assert
      expect(mockAppService.runSeeder).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });
});
