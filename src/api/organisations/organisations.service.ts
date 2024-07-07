import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { AddUserToOrgDto } from './dto/add-user-to-org.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organisation } from './entities/organisation.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(createOrganisationDto: CreateOrganisationDto) {
    try {
      const org = this.organisationsRepository.create(createOrganisationDto);
      return {
        status: 'success',
        message: 'Organisation created successfully',
        data: await this.organisationsRepository.save(org),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        status: 'Bad request',
        message: 'Client error',
        statusCode: 400,
      });
    }
  }

  async findAll(userId: string) {
    const orgs = await this.organisationsRepository.find({
      where: { users: { userId } },
    });
    return {
      status: 'success',
      message: 'Here are the organisations you belong to',
      data: { organisations: orgs },
    };
  }

  async findOne(orgId: string) {
    const org = await this.organisationsRepository.findOne({
      where: { orgId },
    });
    if (!org) throw new NotFoundException();
    return {
      status: 'success',
      message: 'Here is the organisation you requested',
      data: org,
    };
  }

  async addUserToOrg(orgId: string, addUserToOrg: AddUserToOrgDto) {
    const user = await this.usersRepository.findOne({
      where: { userId: addUserToOrg.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const organisation = await this.organisationsRepository.findOne({
      where: { orgId },
      relations: { users: true },
    });
    if (!organisation) throw new NotFoundException('Organisation not found');

    organisation.users.push(user);
    this.organisationsRepository.save(organisation);

    return {
      status: 'success',
      message: 'User added to organisation successfully',
    };
  }
}
