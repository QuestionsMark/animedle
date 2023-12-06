import { Test, TestingModule } from '@nestjs/testing';
import { AnimedleController } from './animedle.controller';
import { AnimedleService } from './animedle.service';

describe('AnimedleController', () => {
  let controller: AnimedleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimedleController],
      providers: [AnimedleService],
    }).compile();

    controller = module.get<AnimedleController>(AnimedleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
