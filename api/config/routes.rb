Rails.application.routes.draw do
  get '/challenges/random', to: 'challenges#random'
end
