export const getInitials = (name) =>
  name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

export const toNumber = (value) => {
  const numeric = Number.parseInt(value, 10);
  return Number.isNaN(numeric) ? 0 : numeric;
};
