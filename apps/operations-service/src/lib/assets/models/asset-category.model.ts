import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AssetsCategories } from '@prisma/client';
import { Asset } from './asset.model';

@ObjectType({
  description: 'asset category'
})
export class AssetCategory {
  @Field(() => ID, {
    nullable: false,
    description: 'category id'
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
    description: 'category name'
  })
  name!: string;

  @Field(() => String, {
    nullable: true,
    description: 'category description'
  })
  description: string;

  @Field(() => Number, {
    nullable: true,
    description: 'category sort order'
  })
  sortBy: number;

  @Field(() => Date, {
    nullable: true,
    description: 'category disabled date'
  })
  disabledAt: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'category published date'
  })
  publishAt: Date;

  @Field(() => Date, {
    nullable: false,
    description: 'category last update date'
  })
  updatedAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: 'category created date'
  })
  createdAt!: Date;

  @Field(() => [Asset], {
    nullable: true,
    defaultValue: [],
    description: 'category assets'
  })
  assets: Asset[];

  static toModel(data: AssetsCategories):  AssetCategory {
    return JSON.parse(JSON.stringify(data)) as AssetCategory;
  }
}
