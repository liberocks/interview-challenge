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
      // Setup
      mockAppService.getHello.mockReturnValue(
        'Welcome to the backend service!',
      );

      // Execute
      const res = appController.getHello();

      // Assess
      expect(mockAppService.getHello).toHaveBeenCalled();
      expect(res).toBe('Welcome to the backend service!');
    });
  });

  describe('seeder', () => {
    it('should run seeder', async () => {
      // Setup
      const expectedResult = 'Seeder completed successfully';
      mockAppService.runSeeder.mockResolvedValue(expectedResult);

      // Execute
      const res = await appController.runSeeder();

      // Assess
      expect(mockAppService.runSeeder).toHaveBeenCalled();
      expect(res).toBe(expectedResult);
    });
  });
});
