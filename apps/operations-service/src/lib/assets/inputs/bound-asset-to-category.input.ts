import { IsUUID } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BoundAssetToCategoryArgs {
  @Field({ nullable: false, description: 'category id' })
  categoryId!: string;
  @Field((type) => [String], { nullable: false, description: 'bind list of asset ids to category' })
  @IsUUID('all', {
    each: true,
  })
  boundAssets!: string[];
  @Field((type) => [String], { nullable: false, description: 'unbind list of asset ids from category' })
  @IsUUID('all', {
    each: true,
  })
  unBoundAssets!: string[];
}
