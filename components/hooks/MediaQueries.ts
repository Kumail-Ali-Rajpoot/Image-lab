export const xs = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
export const sm = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
export const md = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
export const lg = typeof window !== 'undefined' ? window.innerWidth < 1280 : false;
export const xl = typeof window !== 'undefined' ? window.innerWidth >= 1280 : true;