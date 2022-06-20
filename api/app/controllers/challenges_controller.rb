class ChallengesController < ApplicationController
  def random
    challenge = Challenge.random(language: params[:language], except: params[:except])
    return render status: 404 unless challenge

    render JSON challenge
  end
end
