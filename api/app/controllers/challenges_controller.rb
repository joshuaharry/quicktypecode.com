class ChallengesController < ApplicationController
  def random
    challenge = Challenge.random(language: params[:language], except: params[:except])
    return render status: 404 unless challenge

    render json: challenge
  end

  def by_id
    challenge = Challenge.find_by(id: params[:id])
    return render status: 404 unless challenge

    render json: challenge
  end
end
