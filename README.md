[![Node.js CI](https://github.com/febeling/synopt/actions/workflows/node.js.yml/badge.svg)](https://github.com/febeling/synopt/actions/workflows/node.js.yml)
# SYNOPT

Command line options package with narrow scope and ease of use.

## Core Ideas

- easy to declare options and flags
- parse command line arguments into option map
- generate usage banner automatically
- don't ever call exit to ease testing

## More Features

- support boolean options (flags)
- long and short option names (e.g. `-s`, `--long`)
- no assumptions about defaults (leave room for config files, and env vars)
- no assumptions about subcommands (but easy to accomodate)
- explicit failure result instead of exceptions
- full Typescript

## Example Usage

```js
import synopt from 'synopt';

// Declare options
synopt
  .name('mkwebmanifest')
  .summary("Generate icons and web manifest for web applications")
  .option("-i", "--icon", "source icon file")
  .option("-n", "--name", "name of the web application")
  .option("--config", "configuration file")
  .option("--outdir", "directory path for generated files")
  .option("--verbose", "print more information the console", { boolean: true })
  .option("-h", "--help", "print information about options", { boolean: true });

// Slice off node executable and script
const argv = process.argv.slice(2);

// Destructure result
const { ok, error, options } = synopt.parse(argv)

if (ok) {
  main(options);
} else {
  // Handle errors: missing value, or unknown options/typos, etc.
  console.log(error);
  console.log(synopt.usage());
  process.exit(1);
}
```
