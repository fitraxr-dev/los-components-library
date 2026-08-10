'use server';

import { cookies } from 'next/headers';


export async function setMenuListPathCookie(value: string) {
  cookies().set('menuListPath', value, {
    path: '/',
    sameSite: 'lax',
  });
}
