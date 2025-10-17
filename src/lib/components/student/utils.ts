interface FullName {
  first: string | null;
  last: string | null;
}

export const formatInitials = ({ first, last }: FullName) => {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase();
};
