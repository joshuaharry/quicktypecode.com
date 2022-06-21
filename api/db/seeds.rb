# Seed with some prepopulated challenges.
RUBY_CHALLENGES = [
  {
    name: 'Ruby Hello World',
    language: 'RUBY',
    code: %(
def hello
  puts "Hello, world!"
end
).strip
  },
  {
    name: 'Ruby Application Record',
    language: 'RUBY',
    code: %(
class Article < ApplicationRecord
  validates :title, presence: true
  validates :body, presence: true, length: { minimum: 10 }
end
).strip
  },
  {
    name: 'Ruby Articles Controller',
    language: 'RUBY',
    code: %(
class ArticlesController < ApplicationController
  def index
    @articles = Article.all
  end

  def show
    @article = Article.find(params[:id])
  end
end
).strip
  }
]

PYTHON_CHALLENGES = [
  {
    name: 'Python Hello World',
    language: 'PYTHON',
    code: %(
def hello_world():
    print("Hello, world!")
    print("This is a Python challenge!")
).strip
  },
  {
    name: 'Python Primality',
    language: 'PYTHON',
    code: %(
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
    return True
).strip
  }
]

C_CHALLENGES = [
  {
    name: 'C Hello World',
    language: 'C',
    code: %(
#include <stdio.h>

int main() {
  printf("Hello, world!\\n");
  return 0;
}
).strip
  },
  {
    name: 'C Factorial',
    language: 'C',
    code: %(
int factorial(int n) {
  if (n < 0 || n > 12) return -1;
  int ans = 1;
  for (int i = 1; i <= n; ++i) {
    ans *= i;
  }
  return ans;
}
).strip
  }
]

Challenge.create([*RUBY_CHALLENGES, *PYTHON_CHALLENGES, *C_CHALLENGES])
