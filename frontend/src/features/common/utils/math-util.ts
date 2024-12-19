const round2Decimel = (value: number) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};
const numberToRupees = (value: number) => {
  if (!Number.isNaN(value)) {
    const val = Math.abs(value);
    if (val >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `${(value / 100000).toFixed(2)} Lakh`;
  }
  return value;
};

export { round2Decimel, numberToRupees };
