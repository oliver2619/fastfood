import { PlayernamePipe } from './playername.pipe';

describe('PlayernamePipe', () => {
  it('create an instance', () => {
    const pipe = new PlayernamePipe();
    expect(pipe).toBeTruthy();
  });
});
