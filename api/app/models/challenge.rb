class Challenge < ApplicationRecord
  validates :name, presence: true
  validates :language, presence: true
  validates :code, presence: true

  def self.random(config)
    language = config[:language]
    except = config[:except]
    return nil unless language

    raise 'UNIMPLEMENTED'
  end
end
