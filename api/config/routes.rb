Rails.application.routes.draw do
  get '/challenges/random', to: 'challenges#random'
  get '/challenges/by-id', to: 'challenges#by_id'
end
