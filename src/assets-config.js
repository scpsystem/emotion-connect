// Semua laluan aset di sini. Ganti fail dalam public/assets/ dengan nama yang sama,
// atau ubah laluan di bawah. BASE_URL memastikan laluan betul di GitHub Pages.
const b = import.meta.env.BASE_URL;
export const ASSETS = {
  maskot: `${b}assets/maskot/maskot.svg`,
  // Fasa akan datang:
  // temaLautan: `${b}assets/tema/lautan/latar.png`,
  // temaHutan: `${b}assets/tema/hutan/latar.png`,
};
