import expect from 'expect';

import generateMessage from './message';

describe('generateMessage', () => {
  it ('should generate correct message object', () => {
    const from = 'codejockie',
          text = 'Hello, I am running a test';
    const message = generateMessage(from, text);
    // expect(message.from).toEqual(from);
    // expect(message.text).toEqual(text);
    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({ from, text });
  });
});
