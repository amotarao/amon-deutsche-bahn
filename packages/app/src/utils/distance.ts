const R = Math.PI / 180;

export const calcDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const lat1n = lat1 * R;
  const lng1n = lng1 * R;
  const lat2n = lat2 * R;
  const lng2n = lng2 * R;
  return (
    6371 *
    Math.acos(
      Math.cos(lat1n) * Math.cos(lat2n) * Math.cos(lng2n - lng1n) +
        Math.sin(lat1n) * Math.sin(lat2n),
    )
  );
};
