import { Test, TestingModule } from '@nestjs/testing';
import { AnimedleService } from './animedle.service';

describe('AnimedleService', () => {
  let service: AnimedleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimedleService],
    }).compile();

    service = module.get<AnimedleService>(AnimedleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
