import { Auth, API } from 'aws-amplify';

export const authz = () => {
  return Auth.currentSession().then(session => {
    const token = session.idToken.jwtToken;
    let myInit = { // OPTIONAL
      headers: {
        Authorization: token
      }
    }
    return API.get("authzVialScanner", "/authzVialScanner", myInit).then(response => {
//      console.log(JSON.stringify(response));
      return true;
    }).catch(error => {
      console.log(error);
      console.log("Error in authz API call: " + error.response);
      return false;
    });
  }).catch(error => {
    console.log("Error in Auth.currentSession: " + error.response);
    return false;
  });
}
