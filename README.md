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
