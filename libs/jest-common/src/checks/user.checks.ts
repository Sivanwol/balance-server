import { GenerateUserIncludeMock, UserMock, UserProfileMock } from '@balancer/jest-common/mocks/user.mock';
import { UserModel } from '@balancer/utils-server/models/user.model';


export const checkUserDbModel = async (entityMock: UserMock, entityModel) => {
  expect(entityModel).not.toBeNull()
  expect(entityMock.id).toEqual(entityModel?.id)
  expect(entityMock.email).toEqual(entityModel?.email)
  expect(entityMock.emailVerified).toEqual(entityModel?.emailVerified)
  expect(entityMock.verifiedAccessAt).toEqual(entityModel?.verifiedAccessAt)
  expect(entityMock.image).toEqual(entityModel?.image)
  expect(entityMock.mobile).toEqual(entityModel?.mobile)
  // expect(entityMock.mobileVerified).toEqual(entityModel?.mobileVerified)
  if (entityMock.userProfile) {
    expect(entityMock.userProfile).toBeDefined()
    expect(entityMock.userProfile.firstName).toEqual(entityModel?.userProfile?.firstName)
    expect(entityMock.userProfile.lastName).toEqual(entityModel?.userProfile?.lastName)
  }
}

export const checkUserModel = async (entityMock: UserMock, entityModel: UserModel | null) => {
  expect(entityModel).not.toBeNull()
  expect(entityMock.id).toEqual(entityModel?.id)
  expect(entityMock.email).toEqual(entityModel?.email)
  expect(entityMock.emailVerified).toEqual(entityModel?.emailVerified)
  expect(entityMock.verifiedAccessAt).toEqual(entityModel?.verifiedAccessAt)
  expect(entityMock.image).toEqual(entityModel?.image)
  expect(entityMock.mobile).toEqual(entityModel?.mobile)
  // expect(entityMock.mobileVerified).toEqual(entityModel?.mobileVerified)
  if (entityMock.userProfile) {
    expect(entityMock.userProfile).toBeDefined()
    expect(entityMock.userProfile.firstName).toEqual(entityModel?.profile?.firstName)
    expect(entityMock.userProfile.lastName).toEqual(entityModel?.profile?.lastName)
  }
  if (entityModel?.access_token) {
    expect(entityModel?.access_token?.token).not.toBeNull()
  }
}

export const checkUserEntity = async (entityMock: UserMock,entityProcess: any, userIncludes?: GenerateUserIncludeMock) => {
  expect( entityMock.id ).toEqual( entityProcess.id )
  expect( entityMock.email ).toEqual( entityProcess.email )
  expect( entityMock.emailVerified ).toEqual( entityProcess.emailVerified )
  expect( entityMock.password ).toEqual( entityProcess.password )
  expect( entityMock.verifiedAccessAt ).toEqual( entityProcess.verifiedAccessAt )
  expect( entityMock.verifiedAccessMethod ).toEqual( entityProcess.verifiedAccessMethod )
  expect( entityMock.createdAt ).toEqual( entityProcess.createdAt )
  expect( entityMock.updatedAt ).toEqual( entityProcess.updatedAt )
  if (!userIncludes?.userProfile)
    expect( entityProcess.userProfile ).toBeNull()
  if (userIncludes?.userProfile) {
    expect( entityMock.userProfile ).not.toBeNull()
    expect( entityProcess.userProfile ).not.toBeNull()
    await checkUserProfileEntity(entityMock.userProfile as UserProfileMock, entityProcess.userProfile as UserProfileMock)
  }
}

export const checkUserProfileEntity = async (entityMock: UserProfileMock,entityProcess: UserProfileMock) => {
  expect(entityMock.id).toEqual(entityProcess.id)
  expect(entityMock.firstName).toEqual(entityProcess.firstName)
  expect(entityMock.lastName).toEqual(entityProcess.lastName)
  expect(entityMock.createdAt).toEqual(entityProcess.createdAt)
  expect(entityMock.updatedAt).toEqual(entityProcess.updatedAt)
}
