import { tokenize, TokenMatrix, PATTERNS } from "./tokenize";

const matchString = (check: string) => {
  const res = PATTERNS["STRING"].exec(check);
  PATTERNS["STRING"].lastIndex = 0;
  return res;
};

describe("Tokenization", () => {
  test("Works consistently on a Python program", () => {
    const str = `
import math

def is_prime(num):
    if num < 2:
        return False
    if num == 2:
        return True
    top = math.ceil(math.sqrt(num))
    for i in range(2, top + 1):
        if num % i == 0:
            return False
    return True`;
    const initLength = tokenize(str, 'PYTHON').length;
    for (let i = 0; i < 10; ++i) {
      expect(tokenize(str, 'PYTHON').length).toEqual(initLength);
    }
  });
  test("Strings can be single quotes, double quotes, or back quotes", () => {
    expect(matchString(`"This is a test"`)).not.toBe(null);
    expect(matchString(`'This is a test'`)).not.toBe(null);
    expect(matchString("`This is a test`")).not.toBe(null);
  });
  test("Strings can be escpaed using one escape character", () => {
    const theString = `"This is a \\" test"`;
    const match = matchString(theString);
    if (match === null) {
      throw new Error("Expected to match escape character");
    }
    expect(match[0]).toEqual(theString);
  });
  test("Strings can be escpaed using lots of escape characters", () => {
    const theString = `"This is a \\\\\\\\\\\" test"`;
    const match = matchString(theString);
    if (match === null) {
      throw new Error("Expected to match escape character");
    }
    expect(match[0]).toEqual(theString);
  });
  test("We break appropriately if there are two strings", () => {
    const first = '"First \\\\\\\\\\" test"';
    const second = '"Second \\\\\\\\\\" test"';
    const theString = `${first} + ${second}`;
    const match = matchString(theString);
    if (match === null) {
      throw new Error("Expected to match escape character");
    }
    expect(match[0]).toEqual(first);
  });
  test("Works with less than/greater than/pound", () => {
    expect(() => tokenize("#include <stdio.h>", "C")).not.toThrow();
  });
  test("Works with []", () => {
    expect(() => tokenize("x[3]", "C")).not.toThrow();
  });
  test("Works with math operators", () => {
    expect(() => tokenize("x + y", "C")).not.toThrow();
  });
  test("Works with logical and and or", () => {
    expect(() => tokenize("x && y", "C")).not.toThrow();
    expect(() => tokenize("x || y", "C")).not.toThrow();
  });
  test("Works with assignment", () => {
    expect(() => tokenize("x = 4", "C")).not.toThrow();
  });
  test("Works with factorial", () => {
    const factorial = `int factorial(int n) {
  if (n < 0 || n > 12) return -1;
  int ans = 1;
  for (int i = 1; i <= n; ++i) {
    ans *= i;
  }
  return ans;
}`;
    expect(() => tokenize(factorial, "C")).not.toThrow();
  });
  test("Works with is_prime", () => {
    const isPrime = `def is_prime(num):
    if num < 2:
        return False
    if num == 2:
        return True
    top = math.ceil(math.sqrt(num))
    for i in range(2, top + 1):
        if num % i == 0:
            return False
    return True`;
    expect(() => tokenize(isPrime, "PYTHON")).not.toThrow();
  });
  test("Works with an if statement", () => {
    const code = `
  q (|| f`;
    expect(() => tokenize(code, "C")).not.toThrow();
  });
  test("Works with @ symbol", () => {
    expect(() => tokenize("@articles", "RUBY")).not.toThrow();
    expect(() => tokenize("@articles = Foo.new", "RUBY")).not.toThrow();
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
        { syntax: "KEYWORD", text: "def" },
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
        { syntax: "KEYWORD", text: "end" },
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
        { syntax: "KEYWORD", text: "def" },
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
        { syntax: "KEYWORD", text: "int" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "main" },
        { syntax: "LEFT_PAREN", text: "(" },
        { syntax: "KEYWORD", text: "int" },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "IDENTIFIER", text: "argc" },
        { syntax: "COMMA", text: "," },
        { syntax: "WHITESPACE", text: " " },
        { syntax: "KEYWORD", text: "char**" },
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
        { syntax: "KEYWORD", text: "return" },
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
