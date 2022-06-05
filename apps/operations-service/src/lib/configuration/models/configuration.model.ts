import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({})
export class ConfigurationClientSide {
  @Field(() => String, {
    nullable: false,
  })
  key!: string;

  @Field(() => String, {
    nullable: true,
  })
  value!: string;

}
@ObjectType({})
export class Configuration extends ConfigurationClientSide {

  @Field(() => String, {
    nullable: true,
  })
  service!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  isClientSide?: boolean;
  @Field(() => Boolean, {
    nullable: true,
  })
  isEnabled?: boolean;
}
