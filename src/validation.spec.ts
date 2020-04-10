import { Validation } from './validation';
import { expect } from 'chai';
import 'mocha';

describe('Simple validator', () => {

  it('should return true', () => {
    const result = new Validation.SimpleValidator().isAcceptable("qwerty");
    expect(result).to.true;
  });

});