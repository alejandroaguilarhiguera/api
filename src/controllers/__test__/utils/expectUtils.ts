interface HttpOptions {
  status?: number;
}

export default function expectUtils(): void {
  expect.extend({
    toBe(received, expected) {
      const options = {
        comment: 'Object.is equality',
        isNot: this.isNot,
        promise: this.promise,
      };
      const pass = Object.is(received, expected);
      const matcherHint = this.utils.matcherHint('toBe', undefined, undefined, options);
      const printExpected = `TEST => ${this.utils.printExpected(expected)}`;
      const printReceived = `API => ${this.utils.printReceived(received)}`;
      const message = (): string => `${matcherHint}\n\n${printExpected}\n${printReceived}`;
      return { actual: received, message, pass };
    },
    toBeWithinRange(received, floor, ceiling) {
      const pass = received >= floor && received <= ceiling;
      if (pass) {
        return {
          message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
          pass: true,
        };
      }
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    },
    httpValidator(
      response: {
        charset: string;
        type: string;
        error?: { method: string; path: string };
        status: number;
        body: { [key: string]: unknown };
      },
      httpOptions: HttpOptions,
    ) {
      const charset = 'utf-8';
      const type = 'application/json';
      let pass = true;
      let messageText = '';
      if (response.status !== httpOptions.status) {
        pass = false;
        const printExpected = `${this.utils.printExpected(httpOptions.status)}\n`;
        const printReceived = `${this.utils.printReceived(response.status)}\n`;
        messageText += 'La respuesta `status` es diferente\n';
        messageText += printExpected;
        messageText += printReceived;
      }

      if (response.status !== 204 && response.type !== type) {
        pass = false;
        // Valida que las respuestas siempre regresen el valor application/json
        const printExpected = `${this.utils.printExpected(type)}\n`;
        const printReceived = `${this.utils.printReceived(response.type)}\n`;
        messageText += printExpected;
        messageText += printReceived;
      }

      if (response.status !== 204 && response.charset !== charset) {
        pass = false;
        // Valida que las respuestas siempre regresen el valor application/json
        const printExpected = `${this.utils.printExpected(charset)}\n`;
        const printReceived = `${this.utils.printReceived(response.type)}\n`;
        messageText += printExpected;
        messageText += printReceived;
      }
      if (!pass) {
        if (response.error) {
          messageText += `URL: ${response.error.method} ${response.error.path}\n`;
          messageText += `BODY: ${JSON.stringify(response.body)}\n`;
        }
      }
      const message = (): string => messageText;
      return { pass, message };
    },
  });
}
