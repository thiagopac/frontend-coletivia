import { City } from 'src/app/models/city';

export type UserType = IUser | undefined;
export type InfoType = IUserInfo | undefined;

export interface IUser {
  uuid: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  info: IUserInfo;
}

export interface IUserInfo {
  uuid: string;
  first_name: string;
  last_name: string;
  phone: string;
  registration_type: string;
  cpf_cnpj: string;
  city_id: string;
  created_at: Date;
  updated_at: Date;
  city: City;
}
