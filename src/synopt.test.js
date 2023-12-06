import { createCommand } from './synopt';

let synopt;

beforeEach(() => {
  synopt = createCommand('mkstuf');
});

test('usage banner', () => {
  synopt
    .summary('Summary.')
    .description('Description, which is longer.')
    .option("-n", "--name NAME", "Name to be used")
    .option("-f", "--config PATH", "Path to the configuration file")
    .option("--fast", "Fast algorithm", { boolean: true });

  expect(synopt.usage().trim()).toEqual(`Usage: mkstuf [options]

Summary.

Description, which is longer.

    -n,  --name NAME    Name to be used
    -f,  --config PATH  Path to the configuration file
         --fast         Fast algorithm`
  );
});
