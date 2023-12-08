[![Node.js CI](https://github.com/febeling/synopt/actions/workflows/node.js.yml/badge.svg)](https://github.com/febeling/synopt/actions/workflows/node.js.yml)
[![npm version](https://badge.fury.io/js/synopt.svg)](https://badge.fury.io/js/synopt)

# SYNOPT

Command line options package with narrow scope and ease of use.

## Core Ideas

- easy to declare options and flags
- parse command line arguments into option map
- generate usage banner automatically
- don't ever call exit to ease testing

## More Features

- support boolean options (flags)
- support repeat options (`-n first -n second,third` to `["first", "second", "third"]`)
- long and short option names (e.g. `-s`, `--long`)
- use `=` for long format option value (`--name=val`)
- append value to short format option (`-nval`)
- no assumptions about defaults (leave room for config files, and env vars)
- no assumptions about subcommands (but easy to accomodate)
- explicit failure result instead of exceptions
- full Typescript

## Example Usage

```js
import synopt from "synopt";

// Declare options
synopt
  .name("mkwebmanifest") // optional, for usage banner
  .summary("Generate icons and web manifest for web applications")
  .option("-i", "--icon ICON", "source icon file")
  .option("-n", "--name", "name of the web application", { repeat: true })
  .option("--config FILE", "configuration file")
  .option("--outdir <directory>", "directory path for generated files")
  .option("--verbose", "more output", { boolean: true })
  .option("-h", "--help", "print help", { boolean: true });

// Slice off node executable and script from argument vector
const argv = process.argv.slice(2);

// And parse arguments. No exceptions to catch, instead check result object
const { ok, error, options } = synopt.parse(argv);

if (ok) {
  // Happy case
  main(options);
} else {
  // Handle errors: missing value, or unknown options/typos, etc.
  console.log(error);
  console.log(synopt.usage());
  process.exit(1);
}
```

`synopt.usage()` generates this usage banner.

```
Usage: mkwebmanifest [options]

Generate icons and web manifest for web applications

    -i,  --icon ICON           source icon file
    -n,  --name NAME           name of the web application
         --config FILE         configuration file
         --outdir <directory>  directory path for generated files
         --verbose             more output
    -h,  --help                print help

```

Synopt doesn't make assumptions about programs with subcommands (e.g. `git branch`), which often come with separate sets of options. But multiple sets of options are supported by `createCommand(name)` instead of importing the default `synopt`.

```js
import { createCommand } from "synopt";

const init = createCommand("init")
  .option("--quiet", { boolean: true })
  .option("-h", "--help");

const store = createCommand("store")
  .option("-v", "--verbose", { boolean: true })
  .option("--name");
```

## Command API

**`option([short], long, [description], [options])`**

Declares an option. Only the `long` form (`--task NAME`) is required, which consists of two dashes (`--`) and the option's name, optionally followed by the argument name to be shown in the usage banner (`NAME`). If the argument name is left off, the option name will be assumed (e.g. `--task TASK`).

The optional `short` form starts with a single dash (`-`), followed by a single letter. This form can appear in first or second position of parameters.

The optional description explains the meaning of the option, e.g. you can say if it's mandatory, or has certain legal values, or other contstraints.

The declaration options are passed as an object in last position of the arguments. `boolean` indicates an option which doesn't require a value (e.g. typical cases are `--quiet` or `--dry-run`).

`option` can be chained, because it returns the command itself.
``

**`summary(text)`**

This sets a summary text to be show on the usage banner. Returns the command itself for chaining.

**`description(text)`**

This sets a description to be show on the usage banner, below the summary. Returns the command itself for chaining.

**`name(text)`**

This sets a name to be show on the usage banner. Returns the command itself for chaining.

**`parse(argv)`**

Parse the arguments from the command line against the declared options and never throws an exception. Returns an result object of `{ ok, options, error }`. Check `ok` for success of the parsing of the `options`, and display `error` to inform the user of problems.

The option object has this structure: `string` to `string | boolean | string[]`. The value is `string`, unless it's declared a `boolean` option, or a repeat option (`string[]`).

**`usage()`**

Return the usage banner as a string.

**`createCommand([name])`**

Create a command object, with an optional name. In many cases the name should be the executable, but sometimes an executable has subcommands with separate option interfaces each. You can create a command object for each subcommand.

If you use the convenience default `import synopt from 'synopt;`, this is a command without a name set yet.
