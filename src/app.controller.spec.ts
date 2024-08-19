import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('search', () => {
    it('should call appService.search with the request object', () => {
      const req = { query: { q: 'search query' } };
      const searchSpy = jest.spyOn(appService, 'search');

      appController.search(req);

      expect(searchSpy).toHaveBeenCalledWith(req.query.q);
    });

    it('should return the result of appService.search', async () => {
      const req = { query: 'search query' };
      const expectedResult = { result: 'search result' };
      jest.spyOn(appService, 'search').mockResolvedValue(expectedResult);

      const result = await appController.search(req);

      expect(result).toBe(expectedResult);
    });
  });
});
