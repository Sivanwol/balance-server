import { MinLength, IsUrl, IsJSON, IsNumber, Max, Min } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import graphqlTypeJson from 'graphql-type-json';

@InputType()
export class UploadNewAssetArgs {
  @Field({ nullable: false, description: 'category id' })
  categoryId!: string;
  @Field({ nullable: false, description: 'file name with ext etc "filename.png"' })
  @MinLength(5)
  fileName!: string;

  @Field({ nullable: false, description: 'what bucket asset located exmole' })
  @MinLength(5)
  bucket!: string;

  @Field({ nullable: false, description: 'where in the bucket file located' })
  path!: string;

  @Field({ nullable: false, description: 'asset public url' })
  @IsUrl()
  publicUrl!: string;

  @Field(() => Number, {
    nullable: true,
    defaultValue: 0,
    description: 'asset sort order',
  })
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  @Min(1)
  @Max(9)
  sortBy?: number;
  @Field(() => graphqlTypeJson, {
    nullable: true,
    description: 'asset meta data',
  })
  @IsJSON()
  metaData?: object;
}
