import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'client side configuration setting'
})
export class ConfigurationClientSide {
  @Field(() => String, {
    nullable: false,
    description: 'config key'
  })
  key!: string;

  @Field(() => String, {
    nullable: true,
    description: 'config value (need convert to json)'
  })
  value!: string;

}
@ObjectType({
  description: 'platform configuration setting'
})
export class Configuration extends ConfigurationClientSide {

  @Field(() => String, {
    nullable: true,
    description: 'what platform service this belong'
  })
  service!: string;

  @Field(() => Boolean, {
    nullable: false,
    description: 'is client side'
  })
  isClientSide?: boolean;
  @Field(() => Boolean, {
    nullable: true,
    description: 'is enabled'
  })
  isEnabled?: boolean;
}
