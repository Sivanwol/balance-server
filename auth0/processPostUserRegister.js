/**
* Handler that will be called during the execution of a PostUserRegistration flow.
*
* @param {Event} event - Details about the context and user that has registered.
*/

exports.onExecutePostUserRegistration = async (event) => {
  const axios = require('axios')
  const user = {
    userName: event.user.username,
    displayName: event.user.nickname || '',
    fullName: event.user.name || '',
    email: event.user.email
  }
  await axios.post(`${event.secrets.API_BACKEND}/register/user/${event.user.user_id.replace('auth0|','')}`, user , {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-service-api-key': event.secrets.API_SECRET_TOKEN
    },
  })
};
