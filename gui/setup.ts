import crypto from 'crypto';

Object.defineProperty(global.window, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID(),
  }
});
