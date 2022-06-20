class CreateChallenges < ActiveRecord::Migration[7.0]
  def change
    create_table :challenges do |t|
      t.string :language
      t.string :code

      t.timestamps
    end
  end
end
