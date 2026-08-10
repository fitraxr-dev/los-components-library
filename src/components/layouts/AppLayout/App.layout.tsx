'use client';
import '@/public/styles/main.scss';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import NiceModal from '@ebay/nice-modal-react';
import { registerLicense } from '@syncfusion/ej2-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import { pdfjs } from 'react-pdf';

import { msalConfig } from '@/configs/authConfig';
import { DirtyProvider } from '@/contexts/DirtyContext';
import { getCookie, removeCookie } from '@/helpers/cookie';

import { AppProvider } from '@/components/layouts/AppLayout/App.context';

import MUILayout from '../MUILayout/MUI.layout';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_KEY);

export const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize();

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const AppLayout = ({ children }) => {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);


  axios.interceptors.request.use(function (config) {
    const token = getCookie('token');
    const userId = getCookie('userId');

    if (token) config.headers.Authorization = `${token}`;

    // Remove later
    config.headers['user-id'] = userId;

    if (!config.headers.Accept) {
      config.headers.Accept = 'application/json';
    }

    config.headers['X-LOS-API-Version'] = 1;

    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(function (res) {
    return res;
  }, function (error) {
    if (error.response.status === 401) {
      removeCookie('token');
      removeCookie('userId');
    }

    return Promise.reject(error);
  });

  return (
    <html>
      <body>
        <DirtyProvider>
          <QueryClientProvider client={queryClient}>
            <AppProvider>
              <MsalProvider instance={msalInstance}>
                <MUILayout>
                  <NiceModal.Provider>
                    {children}
                  </NiceModal.Provider>
                </MUILayout>
                <ReactQueryDevtools initialIsOpen={false} />
              </MsalProvider>
            </AppProvider>
          </QueryClientProvider>
        </DirtyProvider>
        {/* <CallCenter /> */}
      </body>
    </html>
  );
};

export default AppLayout;
