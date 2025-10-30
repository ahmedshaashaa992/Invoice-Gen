const CACHE_NAME = 'invoice-generator-v3';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/lib/storage.ts',
  '/lib/emailService.ts',
  '/contexts/LanguageContext.tsx',
  '/hooks/useTranslation.ts',
  '/translations/en.json',
  '/translations/de.json',
  '/components/Auth.tsx',
  '/components/InvoiceForm.tsx',
  '/components/InvoicePreview.tsx',
  '/components/CustomerList.tsx',
  '/components/CustomerForm.tsx',
  '/components/TemplateList.tsx',
  '/components/ChangePasswordModal.tsx',
  '/components/ForgotPasswordModal.tsx',
  '/components/icons/DocumentIcon.tsx',
  '/components/icons/UserGroupIcon.tsx',
  '/components/icons/PlusIcon.tsx',
  '/components/icons/TrashIcon.tsx',
  '/components/icons/PencilIcon.tsx',
  '/components/icons/XMarkIcon.tsx',
  '/components/icons/TemplateIcon.tsx',
  '/components/icons/LogoutIcon.tsx',
  '/components/icons/DocumentDuplicateIcon.tsx',
  '/components/icons/UserIcon.tsx',
  '/components/icons/KeyIcon.tsx',
  '/components/icons/GlobeAltIcon.tsx',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add all URLs to cache, but don't fail the install if one fails
        const cachePromises = URLS_TO_CACHE.map(url => {
            return cache.add(url).catch(err => {
                console.warn(`Failed to cache ${url}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
               if (networkResponse.type !== 'opaque') console.log('Not caching non-basic/opaque response:', event.request.url);
            }
            return networkResponse;
          }
        );
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});