import ISchema from './ISchema';
import { UserSchema } from './userSchema';
import { ConfigSchema } from './configSchema';

const schemas: ISchema[] = [
  new UserSchema,
  new ConfigSchema
];

export default schemas;
