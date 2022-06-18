const R = Math.PI / 180;

export const calcDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  lat1 *= R;
  lng1 *= R;
  lat2 *= R;
  lng2 *= R;
  return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
};
