import { BrowserCacheLocation } from '@azure/msal-browser';


export const msalConfig = {
  auth: {
    authority: process.env.NEXT_PUBLIC_AZURE_AD_AUTHORITY,
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage, // "sessionStorage"
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ['User.Read'],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: process.env.NEXT_PUBLIC_GRAPH_API_ENDPOINT,
};
