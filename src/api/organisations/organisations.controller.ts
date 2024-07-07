import { Controller, Get, Post, Body, Param, Request, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddUserToOrgDto } from './dto/add-user-to-org.dto';

@Controller('api/organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createOrganisationDto: CreateOrganisationDto) {
    return this.organisationsService.create(createOrganisationDto);
  }

  @Post(':orgId/users')
  addUserToOrg(
    @Param('orgId', ParseUUIDPipe) orgId: string,
    @Body() addUserToOrgDto: AddUserToOrgDto
  ) {
    return this.organisationsService.addUserToOrg(orgId, addUserToOrgDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() request) {
    return this.organisationsService.findAll(request.user.sub);
  }

  @Get(':orgId')
  @UseGuards(AuthGuard)
  findOne(@Param('orgId') orgId: string) {
    return this.organisationsService.findOne(orgId);
  }
}
