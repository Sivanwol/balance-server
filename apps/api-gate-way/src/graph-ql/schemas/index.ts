import ISchema from './ISchema';
import { AuthSchema } from './authSchema';
import { UserSchema } from './userSchema';

const schemas: ISchema[] = [
  new AuthSchema,
  new UserSchema
];

export default schemas;
