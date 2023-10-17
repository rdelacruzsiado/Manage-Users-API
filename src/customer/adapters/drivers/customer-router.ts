import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { ForManagingCustomer } from '../../ports/drivers';
import {
  CreateCustomerDto,
  SearchCustomerDto,
  UpdateCustomerDto,
} from '../../app/dtos';
import { tokenPayload } from '../../../user/app/models';

@ApiTags('Customer')
@Controller('customer')
@UseGuards(AuthGuard('jwt'))
export class CustomerController {
  constructor(private readonly forManagingCustomer: ForManagingCustomer) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers by user' })
  async getAll(@Req() req: Request) {
    const token = req.user as tokenPayload;
    const userId = token.sub;
    return await this.forManagingCustomer.getAllByUserId(userId);
  }

  @Get('search')
  @ApiOperation({
    summary:
      'Get one customer by name, lastName or email. At least one parameter is required',
  })
  async search(
    @Query(new ValidationPipe({ transform: true })) query: SearchCustomerDto,
  ) {
    return await this.forManagingCustomer.findOne(query);
  }

  @Get(':customerId')
  @ApiOperation({ summary: 'Get one customer by id' })
  async getOne(@Param('customerId') customerId: string) {
    return await this.forManagingCustomer.getOneById(customerId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  async create(@Req() req: Request, @Body() customerData: CreateCustomerDto) {
    const token = req.user as tokenPayload;
    const userId = token.sub;
    return await this.forManagingCustomer.create({ ...customerData, userId });
  }

  @Put(':customerId')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiBody({ type: UpdateCustomerDto })
  async update(
    @Param('customerId') customerId: string,
    @Body() customerData: UpdateCustomerDto,
  ) {
    return await this.forManagingCustomer.update(customerId, customerData);
  }

  @Delete(':customerId')
  @ApiOperation({ summary: 'Delete a customer' })
  async delete(@Param('customerId') customerId: string) {
    return await this.forManagingCustomer.delete(customerId);
  }
}
