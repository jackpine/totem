class RemoveSupersededPlaces < ActiveRecord::Migration

  def up
      res = ActiveRecord::Base.connection.execute("select id from places where jsonb_array_length(import_metadata->'wof:superseded_by') > 0 ;")
      count = 0
      res.map do |r|
        place = Place.find(r['id'])
        place.destroy
        count += 1
      end
      puts "Destroyed #{count} superseded places"
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "Can't recover the deleted places"
  end

end
