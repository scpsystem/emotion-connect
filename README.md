# Emotion Connect — Fasa 1

Halaman Utama, Log Masuk, Pendaftaran (3 langkah), Lupa Kata Laluan, Lengkapkan Profil, halaman sementara.

## Menyambung ke Firebase
1. Buka https://console.firebase.google.com → **Add project**.
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**.
3. **Build → Firestore Database → Create database** (pilih lokasi berdekatan, contoh `asia-southeast1`), mula dalam *production mode*.
4. Tab **Rules**: tampal kandungan `firestore.rules` → **Publish**.
5. **Project settings (⚙) → Your apps → Web (`</>`)** → daftar app → salin objek `firebaseConfig`.
6. `cp .env.example .env.local` dan isi nilai `VITE_FIREBASE_*`.
7. **Authentication → Settings → Authorized domains**: `localhost` sudah ada; tambah `<nama-github>.github.io` sebelum deploy.
8. (Pilihan) **Authentication → Templates** → tukar bahasa e-mel tetapan semula kepada Bahasa Melayu.

## Jalankan
```
npm install
npm run dev      # ujian tempatan
npm run build    # binaan produksi
```
Tukar `VITE_BASE` jika nama repo GitHub anda bukan `emotion-connect`.

## Aset
Ganti `public/assets/maskot/maskot.svg` (atau ubah laluan dalam `src/assets-config.js`). Folder tema dan audio disediakan di `public/assets/tema/` dan `public/assets/audio/`.
