import { createCommand } from "./synopt";
import { beforeEach, expect, test } from "@jest/globals";

let synopt;

beforeEach(() => {
  synopt = createCommand("mkstuf");
});

test("parse successfully", () => {
  synopt.option("--name");
  const { options, ok } = synopt.parse(["--name", "Test-1"]);
  expect(options).toEqual({ name: "Test-1" });
});

test("all options are optional", () => {
  synopt
    .option("--name")
    .option("--flag", { boolean: true });
  const { options, ok, error } = synopt.parse([]);
  expect(ok).toBe(true);
  expect(options).toEqual({});
});

test("parse ok means no error", () => {
  synopt.option("--name");
  const { ok, error } = synopt.parse(["--name", "Test-1"]);
  expect(ok).toBe(true);
  expect(error).toBeUndefined();
});

test("parse short option", () => {
  synopt.option("-n", "--name");
  const { options, ok } = synopt.parse(["-n", "Test-1"]);
  expect(ok).toBe(true);
  expect(options).toEqual({ name: "Test-1" });
});

test("unknown options errors", () => {
  synopt.option("-n", "--name");
  const { ok, error } = synopt.parse(["-x"]);
  expect(ok).toBe(false);
  expect(error).toBe("Unknown option (-x)");
});

test("error means no options", () => {
  synopt.option("-n", "--name");
  const { ok, options } = synopt.parse(["-x"]);
  expect(ok).toBe(false);
  expect(options).toBeUndefined();
});

test("last wins if used twice", () => {
  synopt.option("--name");
  const { options, ok } = synopt.parse([
    "--name",
    "Test-1",
    "--name",
    "Test-2",
  ]);
  expect(ok).toBe(true);
  expect(options).toEqual({ name: "Test-2" });
});

test("error if value is missing", () => {
  synopt.option("--name").option("--config");
  const { ok, error } = synopt.parse(["--name"]);
  expect(ok).toBe(false);
  expect(error).toBe(
    `Option '--name' requires value, because it's not boolean flag`
  );
});

test("don't raise if value is missing but boolean", () => {
  synopt.option("--flat", { boolean: true });
  const { options, ok } = synopt.parse(["--flat"]);
  expect(ok).toBe(true);
  expect(options).toEqual({ flat: true });
});

test("missing value (end of input)", () => {
  synopt.option("--name");
  const { ok, error } = synopt.parse(["--name"]);
  expect(ok).toBe(false);
  expect(error).toBe(
    `Option '--name' requires value, because it's not boolean flag`
  );
});

test("missing value (next is option short or long)", () => {
  synopt.option("--name").option("--flat", { boolean: true });
  const { ok, error } = synopt.parse(["--name", "--flat"]);
  expect(ok).toBe(false);
  expect(error).toBe(
    `Option '--name' requires value, because it's not boolean flag`
  );
});
