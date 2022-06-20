class Challenge < ApplicationRecord
  validates :name, presence: true
  validates :language, presence: true
  validates :code, presence: true
end
