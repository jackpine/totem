class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.text :name, null: false
      t.boolean :authoritative, null: false
      t.string :import_source, null: true
      t.jsonb :import_metadata, null: true
      t.multi_polygon :authoritative_boundary, null: true

      t.timestamps null: false
    end
    add_index :places, :name, unique: true
    add_index :places, :authoritative
  end
end
