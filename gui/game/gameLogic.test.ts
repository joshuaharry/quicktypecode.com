import { init, reduce, tokenize, TokenMatrix } from "./gameLogic";

describe("Tokenization", () => {
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
        { syntax: "NEWLINE", text: "\n︎" },
      ],
      [
        { syntax: "WHITESPACE", text: "  " },
        { syntax: "IDENTIFIER", text: "puts" },
        { syntax: "STRING", text: '"Hello, world!"' },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "IDENTIFIER", text: "end" },
        { syntax: "NEWLINE", text: "\n" },
      ],
    ];
    expect(actual).toEqual(expected);
  });
  test("Works on a python program", () => {
    const language = "PYTHON";
    const code = `def this_is_a_test(foo, bar):
    print("Hello, world!")
    print("Python is cool!")
    `;
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
        { syntax: "WHITESPACE", text: "  " },
        { syntax: "IDENTIFIER", text: "print" },
        { syntax: "LEFT_PAREN", text: "(" },
        { syntax: "STRING", text: '"Hello, world!"' },
        { syntax: "RIGHT_PAREN", text: ")" },
        { syntax: "COLON", text: ":" },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "WHITESPACE", text: "  " },
        { syntax: "IDENTIFIER", text: "print" },
        { syntax: "LEFT_PAREN", text: "(" },
        { syntax: "STRING", text: '"Python is cool!"' },
        { syntax: "RIGHT_PAREN", text: ")" },
        { syntax: "COLON", text: ":" },
        { syntax: "NEWLINE", text: "\n" },
      ],
    ];
    expect(actual).toEqual(expected);
  });
  test("Works on a C program", () => {
    const language = "C";
    const code = `int main(int argc, char** argv) {
  printf("Hello, world!\n");
  return 0;
}
    `;
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
        { syntax: "RIGHT_BRACKET", text: "{" },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "WHITESPACE", text: "  " },
        { syntax: "IDENTIFIER", text: "printf" },
        { syntax: "LEFT_PAREN", text: "(" },
        { syntax: "STRING", text: '"Hello, world!"' },
        { syntax: "RIGHT_PAREN", text: ")" },
        { syntax: "SEMICOLON", text: ";" },
        { syntax: "NEWLINE", text: "\n" },
      ],
      [
        { syntax: "WHITESPACE", text: "  " },
        { syntax: "IDENTIFIER", text: "return" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "0" },
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
