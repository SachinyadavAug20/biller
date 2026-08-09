export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 8;

export const validateEmail = (value: string): string | null => {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_REGEX.test(email)) return "Enter a valid email address.";
  return null;
};

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export const getPasswordStrength = (password: string): PasswordStrengthLevel => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score >= 4) return 4;
  if (score === 3) return 3;
  if (score === 2) return 2;
  return 1;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Create a password.";
  if (password.length < PASSWORD_MIN_LENGTH)
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  return null;
};

export const validateCode = (code: string, length = 6): string | null => {
  if (!code) return "Enter the code we sent you.";
  if (code.length < length) return `Enter the ${length}-digit code.`;
  return null;
};
