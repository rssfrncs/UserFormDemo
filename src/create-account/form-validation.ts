import { passwordStrength } from "./password-strength";

export function usernameIsValid(username: string): boolean {
  return username.trim().length > 4;
}

export function passwordIsValid(password: string): boolean {
  return passwordStrength(password) > 15;
}

export function telephoneIsValid(telephone: string): boolean {
  return telephone.trim().length > 5;
}
