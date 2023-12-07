import { createCommand } from "./synopt";
import { beforeEach, expect, test } from "@jest/globals";

let synopt;

beforeEach(() => {
  synopt = createCommand("mkstuf");
});

test("name", () => {
  synopt.option("--name NAME");
  expect(synopt.declarations()).toEqual([
    {
      name: "name",
      long: "--name",
      argname: "NAME",
    },
  ]);
});

test("name default to same in uppercase", () => {
  synopt.option("--code");
  expect(synopt.declarations()).toEqual([
    {
      name: "code",
      long: "--code",
      argname: "CODE",
    },
  ]);
});

test("name with dash", () => {
  synopt.option("--full-name");
  expect(synopt.declarations()).toEqual([
    {
      name: "full-name",
      long: "--full-name",
      argname: "FULL-NAME",
    },
  ]);
});

test("name with underscore", () => {
  synopt.option("--full_name");
  expect(synopt.declarations()).toEqual([
    {
      name: "full_name",
      long: "--full_name",
      argname: "FULL_NAME",
    },
  ]);
});

test("name is required", () => {
  expect(() => {
    synopt.option();
  }).toThrow();
});

test("option flag, short name", () => {
  synopt.option("-n", "--num NUM");
  expect(synopt.declarations()).toEqual([
    {
      name: "num",
      long: "--num",
      argname: "NUM",
      short: "-n",
    },
  ]);
});

test("only short throws", () => {
  expect(() => {
    synopt.option("-n");
  }).toThrow(
    "Option long-form option is required in declaration and used to derive a name: -n",
  );
});

test("description", () => {
  synopt.option("--num NUM", "The number of it");
  expect(synopt.declarations()).toEqual([
    {
      name: "num",
      long: "--num",
      argname: "NUM",
      description: "The number of it",
    },
  ]);
});

test("description can start like a long option", () => {
  synopt.option("--num", "--num defines the number");
  expect(synopt.declarations()).toEqual([
    {
      argname: "NUM",
      name: "num",
      long: "--num",
      description: "--num defines the number",
    },
  ]);
});

test("short can appear after long option", () => {
  synopt.option("--num", "-n", "desc");
  expect(synopt.declarations()).toEqual([
    {
      argname: "NUM",
      name: "num",
      long: "--num",
      short: "-n",
      description: "desc",
    },
  ]);
});

test("boolean", () => {
  synopt.option("--count", "The count", { boolean: true });
  expect(synopt.declarations()).toEqual([
    {
      name: "count",
      argname: "COUNT",
      long: "--count",
      description: "The count",
      boolean: true,
    },
  ]);
});

test("repeat option", () => {
  synopt.option("--domain NAME", { repeat: true });
  expect(synopt.declarations()).toEqual([
    {
      name: "domain",
      argname: "NAME",
      long: "--domain",
      repeat: true,
    },
  ]);
});

test("error when declared again", () => {
  expect(() => {
    synopt.option("--name").option("--name");
  }).toThrow("Duplicate option (--name)");
});

test("error when short option declared again", () => {
  expect(() => {
    synopt.option("--factor", "-f").option("--file", "-f");
  }).toThrow("Duplicate short option (-f)");
});
