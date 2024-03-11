import { isExportDefault } from '../src/controller';

it('is export default', () => {
  expect(isExportDefault([])).toBeTruthy();
  expect(isExportDefault(() => {})).toBeTruthy();
  expect(isExportDefault({ default: [] })).toBeTruthy();
  expect(isExportDefault({ default: () => {} })).toBeTruthy();

  expect(isExportDefault({ default: {} })).toBeFalsy();
  expect(isExportDefault({})).toBeFalsy();
});
