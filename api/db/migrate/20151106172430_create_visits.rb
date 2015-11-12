class CreateVisits < ActiveRecord::Migration
  def change
    create_table :visits do |t|
      t.belongs_to :place, null: false, index: true
      t.st_point :location, null: false, srid: 4326
      t.timestamps null: false
    end
    add_index :visits, :location, using: :gist
  end
end
