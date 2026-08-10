import { APP_ENV } from '@/configs/env';


export function isEnvProduction() {
  return APP_ENV === 'production';
}
