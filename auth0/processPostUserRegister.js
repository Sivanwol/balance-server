/**
* Handler that will be called during the execution of a PostUserRegistration flow.
*
* @param {Event} event - Details about the context and user that has registered.
event.user

An object describing the user on whose behalf the current transaction was initiated.

Includes the following properties:

app_metadata Dictionary. Custom fields that store info about a user that influences the user's access, such as support plan, security roles, or access control groups.
created_at String. Timestamp indicating when the user profile was first created.
email Optional string. (unique) User's email address.
email_verified Boolean. Indicates whether the user has verified their email address.
family_name Optional string. User's family name.
given_name Optional string. User's given name.
last_password_reset Optional string. Timestamp indicating the last time the user's password was reset/changed. At user creation, this field does not exist. This property is only available for Database connections.
multifactor Optional array of strings.
name Optional string. User's full name.
nickname Optional string. User's nickname.
phone_number Optional string. User's phone number. Only valid for users with SMS connections.
phone_verified Optional boolean. Indicates whether the user has verified their phone number. Only valid for users with SMS connections.
picture Optional string. URL pointing to the user's profile picture.
updated_at String. Timestamp indicating when the user's profile was last updated/modified.
user_id String. (unique) User's unique identifier.
user_metadata Dictionary. Custom fields that store info about a user that does not impact what they can or cannot access, such as work address, home address, or user preferences.
username Optional string. (unique) User's username.
*/
import { axios } from 'axios'

exports.onExecutePostUserRegistration = (event) => {
  const user = {
    userName: event.user.username,
    displayName: event.user.nickname,
    fullname: event.user.name,
    email: event.user.email,
    emailVerified: event.user.email_verified,
    phone: event.user.phone,
    phoneVerified: event.user.phone_verified
  }
  axios.post(`${event.secrets.API_BACKEND}/register/user/${event.user.user_id}`, user , {
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data',
      'X-SERVICE-API-KEY': event.secrets.API_SECRET_TOKEN
    },
  })
};
