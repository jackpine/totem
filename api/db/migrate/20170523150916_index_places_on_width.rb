class IndexPlacesOnWidth < ActiveRecord::Migration
  def up
    ActiveRecord::Base.connection.execute("CREATE INDEX index_places_on_boundary_width ON places (ST_Length(ST_LongestLine(boundary,boundary)));")
    ActiveRecord::Base.connection.execute("CREATE INDEX index_places_on_simplified_boundary ON places USING gist (ST_Simplify(boundary, #{Place::ST_SIMPLIFY_FACTOR}, true))")
    ActiveRecord::Base.connection.execute("CREATE INDEX index_places_on_simplified_boundary_geography ON places USING gist (Cast(ST_Simplify(boundary, #{Place::ST_SIMPLIFY_FACTOR}, true) as geography))")

    puts "*******************"
    puts "Run `VACUUM ANALYSE places` in postgres"
    puts "*******************"

  end
  def down
    ActiveRecord::Base.connection.execute("DROP INDEX index_places_on_boundary_width;")
    ActiveRecord::Base.connection.execute("DROP INDEX index_places_on_simplified_boundary;")
    ActiveRecord::Base.connection.execute("DROP INDEX index_places_on_simplified_boundary_geography;")
  end
end
