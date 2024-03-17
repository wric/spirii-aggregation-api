import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', async () => {
      const appController = app.get(AppController);
      const payouts = await appController.getPayouts(
        '2023-03-01',
        '2023-03-31',
      );
      expect(payouts).toHaveLength(5);
    });
  });
});
