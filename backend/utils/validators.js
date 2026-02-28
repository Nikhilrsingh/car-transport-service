export const isEmailValid = (email) =>
  /^\S+@\S+\.\S+$/.test(email);

export const isStrongPassword = (password) =>
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

export const isValidPhone = (phone) =>
  /^(\+91)?[6-9]\d{9}$/.test(phone);
