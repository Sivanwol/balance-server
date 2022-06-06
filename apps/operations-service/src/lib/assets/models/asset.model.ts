import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Assets } from '@prisma/client';
import graphqlTypeJson from 'graphql-type-json'

@ObjectType({
  description: 'asset file registry',
})
export class Asset {
  @Field(() => ID, {
    nullable: false,
    description: 'asset id',
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
    description: 'file name',
  })
  fileName!: string;

  @Field(() => String, {
    nullable: false,
    description: 'path to file',
  })
  path!: string;

  @Field(() => String, {
    nullable: false,
    description: 'bucket (s3 or azure or what ever) name',
  })
  bucket!: string;

  @Field(() => String, {
    nullable: false,
    description: 'asset public url',
  })
  publicUrl!: string;

  @Field(() => Number, {
    nullable: true,
    description: 'asset sort order'
  })
  sortBy!: number;

  @Field(() => Date, {
    nullable: true,
    description: 'category disabled date',
  })
  disabledAt!: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'category published date',
  })
  publishAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: 'category last update date',
  })
  updatedAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: 'category created date',
  })
  createdAt!: Date;

  @Field(() => graphqlTypeJson, {
    nullable: false,
    description: 'asset meta data',
  })
  metaData!: Date;

  static toModel(data: Assets):  Asset {
    return JSON.parse(JSON.stringify(data)) as Asset;
  }
}
