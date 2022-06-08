import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Assets } from '@prisma/client';
import graphqlTypeJson from 'graphql-type-json'

@ObjectType({
  description: 'asset file registry',
})
export class Asset {
  @Field((type) => ID, {
    nullable: false,
    description: 'asset id',
  })
  id!: string;

  @Field((type) => String, {
    nullable: true,
    description: 'file name',
  })
  fileName: string;

  @Field((type) => String, {
    nullable: false,
    description: 'path to file',
  })
  path: string;

  @Field((type) => String, {
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
    defaultValue: 0,
    description: 'asset sort order'
  })
  sortBy?: number;

  @Field(() => Date, {
    nullable: true,
    description: 'category disabled date',
  })
  disabledAt?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'category published date',
  })
  publishAt?: Date;

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
    nullable: true,
    defaultValue: {},
    description: 'asset meta data',
  })
  metaData?: object;

  static toModel(item: Assets):  Asset {
    return {
      id: item.id,
      fileName: item.fileName,
      bucket: item.bucket,
      path: item.path,
      publicUrl: item.publicUrl,
      sortBy: item.sortBy,
      publishAt: item.publishAt,
      disabledAt: item.disabledAt,
      metaData: JSON.parse(JSON.stringify(item.metaData)),
      createdAt:item.createdAt,
      updatedAt:item.updatedAt
    };
  }
}
