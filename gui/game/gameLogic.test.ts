import { init, reduce, tokenize, TokenMatrix, PATTERNS } from "./gameLogic";

const matchString = (check: string) => {
  const res = PATTERNS["STRING"].exec(check);
  PATTERNS["STRING"].lastIndex = 0;
  return res;
};

describe("Tokenization", () => {
  test("Strings can be single quotes, double quotes, or back quotes", () => {
    expect(matchString(`"This is a test"`)).not.toBe(null);
    expect(matchString(`'This is a test'`)).not.toBe(null);
    expect(matchString("`This is a test`")).not.toBe(null);
  });
  test("Strings can be escpaed using one escape character", () => {
    const theString = `"This is a \\" test"`;
    const match = matchString(theString);
    if (match === null) {
      throw new Error('Expected to match escape character');
    }
    expect(match[0]).toEqual(theString);
  });
  test("Strings can be escpaed using lots of escape characters", () => {
    const theString = `"This is a \\\\\\\\\\\" test"`;
    const match = matchString(theString);
    if (match === null) {
      throw new Error('Expected to match escape character');
    }
    expect(match[0]).toEqual(theString);
  });
  test("We break appropriately if there are two strings", () => {
    const first = "\"First \\\\\\\\\\\" test\"";
    const second = "\"Second \\\\\\\\\\\" test\""
    const theString = `${first} + ${second}`
    const match = matchString(theString);
    if (match === null) {
      throw new Error('Expected to match escape character');
    }
    expect(match[0]).toEqual(first);
  });
  test("Fails on an illegal character", () => {
    const code = `42 – 13;`;
    const language = "RUBY";
    expect(() => tokenize(code, language)).toThrow();
  });
  test("Works on a ruby program", () => {
    const code = `def hello
  puts "Hello, world!"
end`;
    const language = "RUBY";
    const actual = tokenize(code, language);
    const expected: TokenMatrix = [
      [
        { syntax: "IDENTIFIER", text: "def" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "hello" },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "WHITESPACE", text: "  " },
        { syntax: "IDENTIFIER", text: "puts" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "STRING", text: '"Hello, world!"' },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "IDENTIFIER", text: "end" },
        { syntax: "NEWLINE", text: "\n" },
      ],
    ];
    expect(expected).toEqual(actual);
  });
  test("Works on a python program", () => {
    const language = "PYTHON";
    const code = `def this_is_a_test(foo, bar):
    print("Hello, world!")
    print("Python is cool!")`;
    const actual = tokenize(code, language);
    const expected: TokenMatrix = [
      [
        { syntax: "IDENTIFIER", text: "def" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "this_is_a_test" },
        { syntax: "LEFT_PAREN", text: "(" },
        { syntax: "IDENTIFIER", text: "foo" },
        { syntax: "COMMA", text: "," },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "bar" },
        { syntax: "RIGHT_PAREN", text: ")" },
        { syntax: "COLON", text: ":" },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "WHITESPACE", text: "    " },
        { syntax: "IDENTIFIER", text: "print" },
        { syntax: "LEFT_PAREN", text: "(" },
        { syntax: "STRING", text: '"Hello, world!"' },
        { syntax: "RIGHT_PAREN", text: ")" },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "WHITESPACE", text: "    " },
        { syntax: "IDENTIFIER", text: "print" },
        { syntax: "LEFT_PAREN", text: "(" },
        { syntax: "STRING", text: '"Python is cool!"' },
        { syntax: "RIGHT_PAREN", text: ")" },
        { syntax: "NEWLINE", text: "\n" },
      ],
    ];
    expect(actual).toEqual(expected);
  });
  test("Works on a C program", () => {
    const language = "C";
    const code = `int main(int argc, char** argv) {
  printf("Hello, world!\\n");
  return 0;
}`;
    const actual = tokenize(code, language);
    const expected: TokenMatrix = [
      [
        { syntax: "IDENTIFIER", text: "int" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "main" },
        { syntax: "LEFT_PAREN", text: "(" },
        { syntax: "IDENTIFIER", text: "int" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "argc" },
        { syntax: "COMMA", text: "," },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "char**" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "argv" },
        { syntax: "RIGHT_PAREN", text: ")" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "LEFT_BRACKET", text: "{" },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "WHITESPACE", text: "  " },
        { syntax: "IDENTIFIER", text: "printf" },
        { syntax: "LEFT_PAREN", text: "(" },
        { syntax: "STRING", text: '"Hello, world!\\n"' },
        { syntax: "RIGHT_PAREN", text: ")" },
        { syntax: "SEMICOLON", text: ";" },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "WHITESPACE", text: "  " },
        { syntax: "IDENTIFIER", text: "return" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "NUMBER", text: "0" },
        { syntax: "SEMICOLON", text: ";" },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "RIGHT_BRACKET", text: "}" },
        { syntax: "NEWLINE", text: "\n" },
      ],
    ];
    expect(actual).toEqual(expected);
  });
});

describe("Our reducer", () => {
  test("Works when you're initializing a game", () => {
    const language = "PYTHON";
    const code = `def this_is_a_test(foo, bar):
    print("Hello, world!")
    print("Python is cool!")
    `;
    const res = reduce(init, {
      type: "INITIALIZE_GAME",
      payload: { language, code },
    });
    expect(res.language).toBe(language);
    expect(res.code).toBe(code);
  });
});
