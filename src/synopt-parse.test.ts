import { createCommand } from './synopt';
import {beforeEach, expect, test} from '@jest/globals';

let synopt;

beforeEach(() => {
  synopt = createCommand('mkstuf');
});

test('parse', () => {
  synopt.option("--name");
  const options = synopt.parse(["--name", "Test-1"]);
  expect(options).toEqual({ name: "Test-1" });
});

test('parse short option', () => {
  synopt.option("-n", "--name");
  const options = synopt.parse(["-n", "Test-1"]);
  expect(options).toEqual({ name: "Test-1" });
});

test('unknown options errors', () => {
  synopt.option("-n", "--name");
  expect(() => {
    synopt.parse(["-x"]);
  }).toThrow('Unknown option');
});

test('non-boolean option', () => {
  synopt.option("--name");
  const options = synopt.parse([]);
  expect(options).toEqual({});
});

test('last wins if used twice', () => {
  synopt.option("--name");
  const options = synopt.parse(["--name", "Test-1", "--name", "Test-2"]);
  expect(options).toEqual({ name: "Test-2" });
});

test('raise if value is missing', () => {
  synopt
    .option("--name")
    .option("--config");
  expect(() => {
    synopt.parse(["--name"]);
  }).toThrow(`Option '--name' requires value, because it's not boolean flag`);
});

test('don\'t raise if value is missing but boolean', () => {
  synopt.option("--flat", { boolean: true });
  expect(() => {
    const opts = synopt.parse(["--flat"]);
  }).not.toThrow();
});

test('missing value (end of input)', () => {
  synopt.option("--name");
  expect(() => {
    const opts = synopt.parse(["--name"]);
  }).toThrow(`Option '--name' requires value, because it's not boolean flag`);
});

test('missing value (next is option short or long)', () => {
  synopt
    .option("--name")
    .option("--flat", { boolean: true });
  expect(() => {
    synopt.parse(["--name", "--flat"]);
  }).toThrow(`Option '--name' requires value, because it's not boolean`);
});
