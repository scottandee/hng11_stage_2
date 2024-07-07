import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationsService } from '../api/organisations/organisations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../api/users/entities/user.entity';
import { Organisation } from '../api/organisations/entities/organisation.entity';

describe('OrganisationsService', () => {
  let service: OrganisationsService;

  const mockUserRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
  const mockOrgRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganisationsService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Organisation),
          useValue: mockOrgRepo,
        },
      ],
    }).compile();

    service = module.get<OrganisationsService>(OrganisationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
