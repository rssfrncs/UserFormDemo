import { passwordStrength } from "./password-strength";

describe("Password strength", () => {
  it("works for the cases given", () => {
    expect(passwordStrength("password")).toBe(12);
    expect(passwordStrength("abcde")).toBe(10);
    expect(passwordStrength("abcdef")).toBe(11);
    expect(passwordStrength("mississippi")).toBe(9);
  });
});
