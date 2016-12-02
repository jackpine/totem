class CreateMessage < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :place_id
      t.integer :user_id
      t.string :subject
      t.text :body
      t.integer :flagged_count, default: 0
      t.st_point :location, null: false, srid: 4326
      t.timestamps
    end
  end
end
