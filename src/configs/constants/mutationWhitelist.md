# Mutation Whitelist System

## Overview
Sistem whitelist ini digunakan untuk mengontrol mutation mana yang tidak boleh memicu global loading backdrop. Mutation yang masuk dalam whitelist biasanya adalah operasi background yang tidak memerlukan perhatian user.

## Cara Penggunaan

### 1. Menambahkan Mutation Key ke Whitelist
Edit file `src/configs/constants/mutationWhitelist.ts`:

```typescript
export const MUTATION_WHITELIST = [
  'notification-seen',
  'background-sync',    // Contoh: sync data di background
  'auto-save',          // Contoh: auto save form
  'polling-update',     // Contoh: update data secara berkala
] as const;
```

### 2. Menggunakan Utility Functions (Recommended)

#### Option A: Menggunakan `createWhitelistedMutationKey`
```typescript
import { createWhitelistedMutationKey } from '@/helpers/mutation';

const mutation = useMutation({
  mutationKey: createWhitelistedMutationKey('background-sync'),
  mutationFn: async (payload) => {
    // ... mutation logic
  },
});
```

#### Option B: Menggunakan `createMutationOptions` (Complete Setup)
```typescript
import { createMutationOptions } from '@/helpers/mutation';

const mutation = useMutation(
  createMutationOptions(
    'auto-save',
    async (formData) => {
      return await api.autoSave(formData);
    },
    {
      onSuccess: (data) => {
        console.log('Auto save successful:', data);
      },
      onError: (error) => {
        console.error('Auto save failed:', error);
      },
    }
  )
);
```

#### Option C: Manual Setup (Legacy)
```typescript
const mutation = useMutation({
  mutationKey: ['background-sync'], // Key harus ada di whitelist
  mutationFn: async (payload) => {
    // ... mutation logic
  },
});
```

### 3. Verifikasi
Mutation dengan key yang ada di whitelist tidak akan memicu global loading backdrop.

## Utility Functions

### `createWhitelistedMutationKey(key: string)`
Membuat mutation key yang kompatibel dengan sistem whitelist.

### `shouldShowGlobalLoading(mutationKey: unknown)`
Mengecek apakah mutation seharusnya menampilkan global loading.

### `createMutationOptions(key, mutationFn, options)`
Helper function untuk membuat complete mutation options dengan whitelist support.

## Best Practices

1. **Gunakan utility functions**: Lebih aman dan konsisten
2. **Gunakan nama yang deskriptif**: `'notification-seen'` lebih baik dari `'ns'`
3. **Konsisten dengan naming convention**: Gunakan kebab-case
4. **Dokumentasikan**: Tambahkan komentar untuk mutation yang kompleks
5. **Test**: Pastikan mutation tidak memicu loading yang tidak diinginkan

## Contoh Use Cases

- **Notification updates**: Update status notifikasi tanpa mengganggu user
- **Background sync**: Sync data di background
- **Auto-save**: Auto save form tanpa loading screen
- **Polling**: Update data secara berkala
- **Analytics**: Track user behavior di background

## Troubleshooting

Jika mutation masih memicu loading backdrop:
1. Pastikan `mutationKey` sudah ditambahkan ke whitelist
2. Pastikan format key sesuai (string dalam array)
3. Check console untuk error
4. Verifikasi bahwa predicate function berjalan dengan benar
5. Gunakan utility functions untuk menghindari format yang salah

## File Structure

```
src/
├── configs/constants/
│   ├── mutationWhitelist.ts          # Main whitelist configuration
│   ├── mutationWhitelist.example.ts  # Usage examples
│   └── mutationWhitelist.md          # Documentation
├── helpers/
│   └── mutation.ts                   # Utility functions
└── components/layouts/MUILayout/
    └── components/PageContainer.tsx  # Global loading logic
``` 