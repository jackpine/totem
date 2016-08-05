class CreateMessage < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :place_id
      t.integer :user_id
      t.text :body
      t.integer :flagged_count, default: 0
    end
  end
end
