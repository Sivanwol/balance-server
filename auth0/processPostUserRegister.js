/**
* Handler that will be called during the execution of a PostUserRegistration flow.
*
* @param {Event} event - Details about the context and user that has registered.
*/

exports.onExecutePostUserRegistration = async (event) => {
  const axios = require('axios')
  const user = {
    userName: event.user.username,
    displayName: event.user.nickname,
    fullname: event.user.name,
    email: event.user.email,
    emailVerified: event.user.email_verified,
    phone: event.user.phone,
    phoneVerified: event.user.phone_verified
  }
  await axios.post(`${event.secrets.API_BACKEND}/register/user/${event.user.user_id}`, user , {
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data',
      'X-SERVICE-API-KEY': event.secrets.API_SECRET_TOKEN
    },
  })
};
