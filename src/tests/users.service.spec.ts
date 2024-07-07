import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../api/users/users.service';
import { Repository } from 'typeorm';
import { User } from '../api/users/entities/user.entity';
import { Organisation } from '../api/organisations/entities/organisation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../api/users/dto/create-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  let orgsRepository: Repository<Organisation>;

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
        UsersService,
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

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const userId = '543';
      const user = {
        firstName: 'Max',
        lastName: 'Man',
        email: 'max@gmail.com',
        password:'$2siY',
        phone: null,
        userId: '543',
      } as User;
      (mockUserRepo.findOne as jest.Mock).mockResolvedValue(user);

      const result = await usersService.findOne(userId);
      expect(result).toEqual({
        status: 'success',
        message: 'Here are your credentials',
        data: user,
      })

    });
    it('should return not found error if it does not exist', async () => {
      const userId = '543';
      (mockUserRepo.findOne as jest.Mock).mockResolvedValue(null);
      await(expect(usersService.findOne(userId)).rejects.toThrow(NotFoundException));
    });
  });

  describe('create', () => {
    it('creates a user and its organisation correctly', async () => {
      const createUserDto = {
        firstName: 'Max',
        lastName: 'Man',
        email: 'max@gmail.com',
        password:'pass',
        phone: null,
      } as CreateUserDto;
      const org = { name: 'Max\'s', description: null, orgId: 'ewe', users: [] } as Organisation;
      const user = { userId: 'ksdmls', ...createUserDto } as User;

      (mockUserRepo.create as jest.Mock).mockResolvedValue(user);
      (mockUserRepo.save as jest.Mock).mockResolvedValue(user);
      (mockOrgRepo.create as jest.Mock).mockResolvedValue(org);
      (mockOrgRepo.save as jest.Mock).mockResolvedValue(org);
      (mockOrgRepo.findOne as jest.Mock).mockResolvedValue(org);
      
      const result = await usersService.create(createUserDto);

      expect(result).toEqual(user);
      expect(mockUserRepo.create).toHaveBeenCalledWith({ ...createUserDto });
      expect(mockOrgRepo.create).toHaveBeenCalledWith({ name: 'Max\'s Organisation' });
      expect(mockOrgRepo.save).toHaveBeenCalledWith(org);
      
    });
  });
});
