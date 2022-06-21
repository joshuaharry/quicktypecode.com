class Challenge < ApplicationRecord
  validates :name, presence: true
  validates :language, presence: true
  validates :code, presence: true

  def self.random(config)
    language = config[:language]
    except = config[:except]
    return nil unless language

    if except.nil?
      where(language: language).order(Arel.sql('RANDOM()')).first
    else
      where(language: language).where.not(id: except).order(Arel.sql('RANDOM()')).first
    end
  end
end
