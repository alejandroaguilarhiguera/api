declare namespace jest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R> {
    httpValidator: (options: { status: number }) => { pass: boolean; message: string };
  }
}
