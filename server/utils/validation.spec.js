import expect from 'expect';

import isRealString from './validation';

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const isAString = isRealString(3000);
    expect(isAString).toEqual(false);
  });

  it('should reject string with only spaces', () => {
    const isAString = isRealString('  ');
    expect(isAString).toEqual(false);
  });

  it('should accept string with non-space characters', () => {
    const isAString = isRealString('codejockie');
    expect(isAString).toEqual(true);
  });
})