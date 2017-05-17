class UndoDoubleEncodedJson < ActiveRecord::Migration
  def up

    # set up new helper method for testing json
    path = Rails.root.join('db/sql/places.sql')
    raw_sql = File.read(path)
    ActiveRecord::Base.connection.execute(raw_sql)

    # destroy bogus json
    Place.find(105259).destroy

    # unescape the old json data
    puts "Updating the double encoded json"
    ActiveRecord::Base.connection.execute("UPDATE places SET import_metadata = (CONCAT('[', import_metadata::text, ']')::json ->> 0)::json;")

    puts "setting up index on the import metadata wof:id"
    ActiveRecord::Base.connection.execute("CREATE UNIQUE INDEX index_wof_id_on_places ON places (((import_metadata->>'wof:id')::int));")
  end

  def down
    raise 'cannot reverse'
  end
end
