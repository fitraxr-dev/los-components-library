import axios from 'axios';

import { getCookie, removeCookie } from '@/helpers/cookie';
import endpoint from '@/services/endpoint';

import type { AxiosError } from 'axios';


const convertToBaseTypeCode = (endpointName: string): string => {
  const baseTypeCodeMap: Record<string, string> = {
    agreement: '/agreement-service',
    auth: '/auth-service',
    bucket: '/bucket-service',
    bucketDocument: '/bucket-document-service',
    creditChecking: '/credit-checking-service',
    dashboard: '/dashboard-service',
    draftMemo: '/draft-memo-service',
    loan: '/loan-service',
    lov: '/lov-service',
    lpa: '/lpa-service',
    master: '/master-service',
    mip: '/mip-service',
    notification: '/notification-service',
    parameter: '/parameter-service',
    processor: '/processor-service',
    report: '/report-service',
    siteVisit: '/site-visit-service',
    technicalReview: '/technical-review-service',
    userManagement: '/user-management-service',
  };

  return baseTypeCodeMap[endpointName] || `/${endpointName}-service`;
};

const serviceHost = process.env.NEXT_PUBLIC_BASE_URL;
const serviceMock = 'https://wso2-gw.cloudias79.com/los-mock-dev/v1';

const serviceOverrides: Record<string, string> = {
  mip: '/api/local-mip',
  processor: '/api/local-processor',
};

const getBaseUrl = (baseType?: string, isMock?: boolean) => {
  if (baseType && serviceOverrides[baseType]) {
    return serviceOverrides[baseType];
  }
  const baseUrl = isMock ? serviceMock : serviceHost;
  return baseUrl + convertToBaseTypeCode(baseType || '');
};

const getCorsProxyUrl = (url: string): string => {
  if (typeof globalThis.window === 'undefined') {
    return url;
  }
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};

const buildMockRequestConfig = (config: any) => {
  if (config.isMock) {
    const fullUrl = `${config.baseURL}${config.url}`;
    config.url = getCorsProxyUrl(fullUrl);
    config.baseURL = '';
    config.withCredentials = false;
  }
  return config;
};

const apiClient = axios.create({
  baseURL: serviceHost,
  headers: {
    'Accept-Language': 'id',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const auth = getCookie('token');
    const idToken = getCookie('userId');

    if (auth) {
      config.headers.Authorization = `Bearer ${auth}`;
    }
    if (idToken) {
      config.headers['X-ID-TOKEN'] = idToken;
    }
    return config;
  },
  (err) => Promise.reject(new Error(err.message ?? 'Request error')),
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    let customError: {
      message: string;
      status: number | null;
      data: any;
      dataNonJson: any;
      rawError: any;
    } = {
      data: null,
      dataNonJson: null,
      message: 'Unknown error',
      rawError: error,
      status: null,
    };

    if (error.response) {
      const responseType = error.config?.responseType || error.response.config?.responseType;
      const isNonJsonResponse = responseType && responseType !== 'json' && responseType !== undefined;

      let responseData = error.response.data;
      let convertedData = null;

      if (isNonJsonResponse) {
        // Try to convert to JSON
        try {
          if (responseData instanceof Blob) {
            const text = await responseData.text();
            convertedData = JSON.parse(text);
          } else if (responseData instanceof ArrayBuffer) {
            const text = new TextDecoder().decode(responseData);
            convertedData = JSON.parse(text);
          } else if (typeof responseData === 'string') {
            convertedData = JSON.parse(responseData);
          } else {
            convertedData = responseData;
          }
        } catch (parseError) {
          // If conversion fails, keep original data
          convertedData = responseData;
          console.warn('Failed to convert non-JSON response to JSON:', parseError);
        }
      } else {
        convertedData = responseData;
      }

      customError = {
        data: convertedData,
        dataNonJson: isNonJsonResponse ? responseData : null,
        message:
          (convertedData as any)?.errorDetail ||
          (convertedData as any)?.detail ||
          (convertedData as any)?.message ||
          error.message,
        rawError: error,
        status: error.response.status,
      };

      // Handling token expired
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.clear();
        localStorage.setItem(
          'Unautorized',
          (convertedData as any)?.message ?? 'Expired Token',
        );
        removeCookie('token');
        removeCookie('userId');
        window.location.replace('/login');
      }
    } else if (error.request) {
      customError = {
        data: null,
        dataNonJson: null,
        message: 'No response from server',
        rawError: error,
        status: null,
      };
    } else {
      customError = {
        data: null,
        dataNonJson: null,
        message: error.message,
        rawError: error,
        status: null,
      };
    }
    console.log('error : ', { ...customError, rawError: 'developer only' });
    return Promise.reject(customError);
  },
);

export const urlBuilder = ({ query, urlApi }) => {
  if (query)
    return Object.keys(query).reduce(
      (url, key) => url?.replace(`:${key}`, query[key]),
      urlApi,
    );
  return urlApi;
};

export const API = (...args) => {
  const [urlMethod, params] = args;
  const [service, name, method] = urlMethod.split('.');

  const context = { ...endpoint[service][name][method], ...params };
  const endpoints = endpoint[service][name][method];

  const baseType = endpoints?.baseType;
  const isMock = endpoints?.isMock;
  context.baseURL = getBaseUrl(baseType, isMock);

  const urlTemp = endpoints?.url;
  context.url = urlBuilder({ ...params, urlApi: urlTemp });

  context.isMock = isMock;
  buildMockRequestConfig(context);

  return apiClient(context);
};

export default apiClient;
