require 'test_helper'

class ChallengesControllerTest < ActionDispatch::IntegrationTest
  test 'If there is no language, we return not found' do
    get '/challenges/random'
    assert_response :not_found
  end
  test 'We can fetch a random challenge provided a language' do
    get '/challenges/random?language=RUBY'
    assert_response :success
  end
end
