import expect from 'expect';

import generateMessage, { generateLocationMessage } from './message';

describe('generateMessage', () => {
  it ('should generate correct message object', () => {
    const from = 'codejockie',
          text = 'Hello, I am running a test';
    const message = generateMessage(from, text);
    
    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({ from, text });
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'codejockie',
      latitude = 20, longitude = 25,
      url = 'https://www.google.com/maps?q=20,25';
    const message = generateLocationMessage(from, latitude, longitude);

    expect(message.createdAt).toBeA('number');
    expect(message.url).toEqual(url);
    expect(message).toInclude({ from, url });
  });
});
