import synopt from "./dist/synopt.js";

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