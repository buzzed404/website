export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function isValidPincode(value) {
  return /^\d{4,8}$/.test(value.trim());
}

export function isValidCardNumber(value) {
  return /^[\d\s]{12,19}$/.test(value.trim());
}
