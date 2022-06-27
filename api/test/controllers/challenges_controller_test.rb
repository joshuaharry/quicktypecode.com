require 'test_helper'

class ChallengesControllerTest < ActionDispatch::IntegrationTest
  test 'If there is no language, we return not found' do
    get '/challenges/random'
    assert_response :not_found
  end
  test 'We can fetch a random challenge provided a language' do
    get '/challenges/random?language=RUBY'
    assert_response :success
    body = JSON.parse(response.body)
    assert body['language'] == 'RUBY'
  end
  test 'We can fetch a random challenge without an id' do
    id = Challenge.all.where(language: 'RUBY').first.id
    get "/challenges/random?language=RUBY&except=#{id}"
    assert_response :success
    body = JSON.parse(response.body)
    assert_not body['id'] == id
  end
  test 'We can fetch a specific challenge by id' do
    id = Challenge.all.where(language: 'RUBY').first.id
    get "/challenges/by-id?language=RUBY&id=#{id}"
    assert_response :success
    body = JSON.parse(response.body)
    assert body['id'] == id
  end
  test 'We get a 404 when the challenge does not exist' do
    id = 'NaN'
    get "/challenges/by-id?language=RUBY&id=#{id}"
    assert_response :not_found
  end
end
