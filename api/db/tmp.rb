foo = %(
#include <stdio.h>

int main() {
  printf("Hello, world!\\n");
  return 0;
}
).strip

puts foo