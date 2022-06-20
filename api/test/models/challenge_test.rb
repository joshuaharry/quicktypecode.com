require 'test_helper'

class ChallengeTest < ActiveSupport::TestCase
  test 'A challenge must have a language' do
    challenge = Challenge.new
    assert_not challenge.save
  end
  test 'A challenge must have code' do
    challenge = Challenge.new
    challenge.language = 'RUBY'
    assert_not challenge.save
  end
  test 'A challenge must have a name' do
    challenge = Challenge.new
    challenge.language = 'RUBY'
    challenge.code = "def hello\n  puts 'Hello!'\nend"
    assert_not challenge.save
  end
  test 'We can save a challenge' do
    challenge = Challenge.new
    challenge.language = 'RUBY'
    challenge.code = "def hello\n  puts 'Hello!'\nend"
    challenge.name = 'Ruby Hello World'
    assert challenge.save
  end
end
