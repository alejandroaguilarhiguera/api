/**
 *
 * @param ms Milliseconds
 */

export default function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
  