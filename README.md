# synopt

Command line options package with the following features.

- declare options and flags
- generate usage information
- parse ARGV into options object
- don't ever call exit to ease automated tests
- support boolean options (flags)
- long and short option names (-s, --long)
- no assumptions about defaults (because maybe there's other config, like env variables and files)
- no assumptions about subcommands (but supported)

