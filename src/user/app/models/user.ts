export type AuthenticatedUser = {
  name: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
};

export interface AuthDetails {
  token: string;
  refreshToken: string;
}

export type User = Pick<AuthenticatedUser, 'name' | 'lastName' | 'email'>;
