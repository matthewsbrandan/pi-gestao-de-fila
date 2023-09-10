const defaultMS : number = 500
export async function delay(ms?: number): Promise<void> {
  if(!ms)  ms = defaultMS
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}