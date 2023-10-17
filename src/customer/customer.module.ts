import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerRepo, CustomerSchema } from '../database/schemas';
import { ForGettingUser, ForRepoQuerying } from './ports/drivens';
import { GetUserAdapter, RepoQuerierAdapter } from './adapters/drivens';
import { ForManagingCustomer } from './ports/drivers';
import {
  CustomerController,
  CustomerManagerProxyAdapter,
} from './adapters/drivers';
import { CustomerService } from './app/customer.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerRepo.name, schema: CustomerSchema },
    ]),
    UserModule,
  ],
  providers: [
    CustomerService,
    {
      provide: ForRepoQuerying,
      useClass: RepoQuerierAdapter,
    },
    {
      provide: ForManagingCustomer,
      useClass: CustomerManagerProxyAdapter,
    },
    {
      provide: ForGettingUser,
      useClass: GetUserAdapter,
    },
  ],
  controllers: [CustomerController],
  exports: [],
})
export class CustomerModule {}
