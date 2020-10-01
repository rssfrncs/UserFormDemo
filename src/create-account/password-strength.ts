/**
 * Write this algorithm:
 *
 * strength = password_length_capped_at_5 + unique_characters_in_password
 *
 * See unit tests for examples
 */
export function passwordStrength(password: string): number {
  let score = 0;
  score += Math.min(password.length, 5);
  score += password
    .split("")
    .reduce<string[]>(
      (uniq, char) => (uniq.includes(char) ? uniq : [...uniq, char]),
      []
    ).length;
  return score;
}
