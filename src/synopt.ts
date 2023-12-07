interface Command {
  name: (text: string) => Command;
  summary: (text: string) => Command;
  description: (text: string) => Command;
  option: (...args: DeclarationTuple) => Command;
  parse: (args: string[]) => object;
  declarations: () => OptionDeclaration[];
  usage: () => string;
}

interface OptionDeclaration {
  boolean?: boolean;
  repeat?: boolean;
  short?: string;
  argname?: string;
  long?: string;
  name?: string;
  description?: string;
}

interface CommandState {
  name?: string;
  optionDeclarations: OptionDeclaration[];
  summary?: string;
  description?: string;
}

interface DeclarationOptions {
  boolean?: boolean;
  repeat?: boolean;
}

type DeclarationTuple = [
  name: string,
  alias?: string,
  description?: string,
  options?: OptionDeclaration,
];

type Options = {
  [key: string]: boolean | string | string[];
};

type ErrorResult = { ok: false; error: string };
type OkResult<T> = { ok: true; options: T };
type Result<T> = OkResult<T> | ErrorResult;

const Ok = <T>(options: T): OkResult<T> => ({ ok: true, options });

const Err = (error: string): ErrorResult => ({
  ok: false,
  error,
});

/**
 * Parse an option declaration list into an argument list parser
 *
 * The object representing the option interface also parses an argument vector
 * into an concrete options object.
 */

const parseDeclaration = (declaration: DeclarationTuple): OptionDeclaration => {
  const decl = declaration.slice().reverse();

  const option: OptionDeclaration = {};

  const reLong = /^(--([-\w]+?))( (<?\w+?>?)?)?$/;
  const reShort = /^-[^-]$/;

  while (decl.length > 0) {
    const elem = decl.pop();
    if (decl.length === 0 && typeof elem === "object") {
      if ((elem as DeclarationOptions).boolean) {
        option.boolean = true;
      }
      if ((elem as DeclarationOptions).repeat) {
        option.repeat = true;
      }
    } else {
      const str = elem as string;
      if (reShort.test(str)) {
        option.short = str;
      } else if (reLong.test(str)) {
        const [, long, name, , argname] = str.match(reLong);
        option.long = long;
        option.argname = argname || name.toUpperCase();
        option.name = name;
      } else if (option.name && !option.description) {
        option.description = str;
      } else {
        throw new Error(`Declaration error: ${declaration}`);
      }
    }
  }

  if (!option.name || !option.long) {
    throw new Error(
      `Option long-form option is required in declaration and used to derive a name: ${declaration}`,
    );
  }

  return option;
};

const ensureNamesUnique = (declaration, declarations): void => {
  const { long, short } = declaration;
  if (declarations.find((d) => d.long === long))
    throw new Error(`Duplicate option (${long})`);
  if (short && declarations.find((d) => d.short === short))
    throw new Error(`Duplicate short option (${short})`);
};

const createCommand = (name?: string): Command => {
  const isOption = (string) => /^-/.test(string);

  const state: CommandState = {
    name,
    optionDeclarations: [],
  };

  const command: Command = {
    name: (text): Command => {
      state.name = text;
      return command;
    },
    summary: (text): Command => {
      state.summary = text;
      return command;
    },
    description: (text): Command => {
      state.description = text;
      return command;
    },
    /**
     * An option declaration.
     *
     * @param {string} [short] - The short form of the option, with this format '-f'
     * @param {string} name - The long option name, this format '--name' (two dashes, name of any length)
     * @param {string} [description] - Descriptive text of the option
     * @param {object} [options] - Options for this declaration. Example `{ boolean: true, required: true }`
     * @return {Command} The option declaration representation object
     */
    option: (...args): Command => {
      const declaration = parseDeclaration(args);
      ensureNamesUnique(declaration, state.optionDeclarations);
      state.optionDeclarations.push(declaration);
      return command;
    },
    parse: (args): Result<Options> => {
      const options: Options = {};

      try {
        for (let i = 0; i < args.length; i++) {
          const element = args[i];
          const nextElement = args[i + 1];
          const elementDecl = state.optionDeclarations.find((decl) => {
            return decl.long === element || decl.short === element;
          });

          if (!elementDecl) {
            throw new Error(`Unknown option (${element})`);
          } else if (elementDecl.boolean) {
            options[elementDecl.name] = true;
          } else if (nextElement && !isOption(nextElement)) {
            if (elementDecl.repeat) {
              options[elementDecl.name] ||= [];
              (options[elementDecl.name] as string[]).push(
                ...nextElement.split(","),
              );
            } else {
              options[elementDecl.name] = nextElement;
            }
            i++;
          } else {
            throw new Error(
              `Option '${element}' requires value, because it's not boolean flag`,
            );
          }
        }
      } catch (error) {
        return Err(error.message);
      }

      return Ok(options);
    },
    declarations: (): OptionDeclaration[] => state.optionDeclarations,
    usage: (): string => {
      const shorts = state.optionDeclarations.map((val) => val.short);
      const longs = state.optionDeclarations.map((val) => val.long);
      const argnames = state.optionDeclarations.map((val) => val.argname);
      const descriptions = state.optionDeclarations.map(
        (val) => val.description,
      );

      const longMax = Math.max(
        ...longs.map((l, i) => {
          let len = l.length;
          if (!state.optionDeclarations[i].boolean) {
            len += argnames[i].length + 1;
          }
          return len;
        }),
      );

      const anyShorts = shorts.filter((x) => x).length > 0;

      const optionHelpLines = longs.map((long, i) => {
        return `    ${
          anyShorts ? (shorts[i] ? shorts[i] + "," : "   ") : ""
        }  ${(
          long + (state.optionDeclarations[i].boolean ? "" : ` ${argnames[i]}`)
        ).padEnd(longMax, " ")}  ${descriptions[i]}`;
      });

      return [
        `Usage: ${state.name || "SCRIPT_NAME"} [options]`,
        ...(state.summary ? ["", state.summary] : []),
        ...(state.description ? ["", state.description] : []),
        "",
        ...optionHelpLines,
      ].join("\n");
    },
  };
  return command;
};

const synopt = createCommand();

export default synopt;
export { createCommand };
