const dev = {
  apiGateway: {
    REGION: "us-gov-west-1",
    URL: "https://7zj1u3rfy9.execute-api.us-gov-west-1.amazonaws.com/prd"
    // URL: "https://9bm89pl9ak.execute-api.us-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-gov-west-1",
    USER_POOL_ID: "us-gov-west-1_Yerqo6rUv",
    APP_CLIENT_ID: "4e450ll69pq651l3o3dkjsda5g",
    DOMAIN: "ctrds.auth-fips.us-gov-west-1.amazoncognito.com",
    REDIRECT_SIGNIN: "http://localhost:4200/",
    REDIRECT_SIGNOUT: "https://shibboleth.arizona.edu/cgi-bin/logout.pl"
  }
};

const test = {
  apiGateway: {
    REGION: "us-gov-west-1",
    URL: "https://7zj1u3rfy9.execute-api.us-gov-west-1.amazonaws.com/prd"
    // URL: "https://9bm89pl9ak.execute-api.us-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-gov-west-1",
    USER_POOL_ID: "us-gov-west-1_Yerqo6rUv",
    APP_CLIENT_ID: "4e450ll69pq651l3o3dkjsda5g",
    DOMAIN: "ctrds.auth-fips.us-gov-west-1.amazoncognito.com",
    REDIRECT_SIGNIN: "https://pcr-lab-test.wellcheck.arizona.edu/",
    REDIRECT_SIGNOUT: "https://shibboleth.arizona.edu/cgi-bin/logout.pl"
  }
};

const prod = {
  apiGateway: {
    REGION: "us-gov-west-1",
    URL: "https://7zj1u3rfy9.execute-api.us-gov-west-1.amazonaws.com/prd"
    // URL: "https://9bm89pl9ak.execute-api.us-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-gov-west-1",
    USER_POOL_ID: "us-gov-west-1_Yerqo6rUv",
    APP_CLIENT_ID: "4e450ll69pq651l3o3dkjsda5g",
    DOMAIN: "ctrds.auth-fips.us-gov-west-1.amazoncognito.com",
    REDIRECT_SIGNIN: "https://pcr-lab.wellcheck.arizona.edu/",
    REDIRECT_SIGNOUT: "https://shibboleth.arizona.edu/cgi-bin/logout.pl"
  }
};

const configMap = {
  'production': prod,
  'testing': test,
  'development': dev
};

const config = configMap[process.env.REACT_APP_STAGE];


export default {
  apiGateway: config.apiGateway,
  cognito: config.cognito
};