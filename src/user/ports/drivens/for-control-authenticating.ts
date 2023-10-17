import { UserRepo } from '../../../database/schemas';
import { AuthDetails } from '../../app/models';

export abstract class ForControlAuthenticating {
  abstract getAuthDetails(user: UserRepo, password: string): AuthDetails;
}
