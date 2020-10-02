import { passwordStrength } from "./password-strength";

type ValidationError =
  | {
      valid: false;
      reason: string;
    }
  | {
      valid: true;
    };

export function usernameIsValid(username: string): ValidationError {
  const usernameLength = username.trim().length;
  if (usernameLength > 4)
    return {
      valid: true,
    };
  else {
    return {
      valid: false,
      reason: `Your username is too short`,
    };
  }
}

export function passwordIsValid(password: string): ValidationError {
  const strength = passwordStrength(password);
  if (strength > 15) {
    return {
      valid: true,
    };
  } else {
    return {
      valid: false,
      reason: `Your password strength is ${strength} but we require a minimum of 15.`,
    };
  }
}

export function telephoneIsValid(telephone: string): ValidationError {
  if (!telephone.split("").every((digit) => !isNaN(parseInt(digit)))) {
    return {
      valid: false,
      reason: "Your telephone contains non numerical values.",
    };
  } else if (telephone.trim().length < 5) {
    return {
      valid: false,
      reason: `Your telephone is ${telephone.length} digit/s but we require a minimum of 5.`,
    };
  } else
    return {
      valid: true,
    };
}
