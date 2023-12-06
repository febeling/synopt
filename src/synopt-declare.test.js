import { createCommand } from './synopt';

let synopt;

beforeEach(() => {
  synopt = createCommand('mkstuf');
});

test('name', () => {
  synopt.option("--name NAME");
  expect(synopt.declarations()).toEqual([{
    name: "name",
    long: "--name",
    argname: "NAME"
  }]);
});

test('name default to same in uppercase', () => {
  synopt.option("--code");
  expect(synopt.declarations()).toEqual([{
    name: "code",
    long: "--code",
    argname: "CODE"
  }]);
});

test('name with dash', () => {
  synopt.option("--short-name");
  expect(synopt.declarations()).toEqual([{
    name: "short-name",
    long: "--short-name",
    argname: "SHORT-NAME"
  }]);
});

test('name with underscore', () => {
  synopt.option("--short_name");
  expect(synopt.declarations()).toEqual([{
    name: "short_name",
    long: "--short_name",
    argname: "SHORT_NAME"
  }]);
});

test('name is required', () => {
  expect(() => {
    synopt.option();
  }).toThrow();
});

test('option flag, short name', () => {
  synopt.option("-n", "--num NUM");
  expect(synopt.declarations()).toEqual([{
    name: "num",
    long: "--num",
    argname: "NUM",
    short: "-n"
  }]);
});

test('only short throws', () => {
  expect(() => {
    synopt.option("-n");
  }).toThrow();
});

test('description', () => {
  synopt.option("--num NUM", "The number of it");
  expect(synopt.declarations()).toEqual([{
    name: "num",
    long: "--num",
    argname: "NUM",
    description: "The number of it"
  }]);
});

test('boolean', () => {
  synopt.option("--count", "The count", { boolean: true });
  expect(synopt.declarations()).toEqual([{
    name: "count",
    argname: "COUNT",
    long: "--count",
    description: "The count",
    boolean: true,
  }]);
});

