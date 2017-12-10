class PruneWofPlaces < ActiveRecord::Migration[5.1]
  def up
    add_column :places, :imported_at_timestamp, :integer
    add_index :places, :imported_at_timestamp
    Place.with_deleted.update_all({ imported_at_timestamp: Time.now.to_time.to_i })
  end

  def down
    remove_column :places, :imported_at_timestamp
  end
end
