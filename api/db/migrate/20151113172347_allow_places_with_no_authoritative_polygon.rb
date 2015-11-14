class AllowPlacesWithNoAuthoritativePolygon < ActiveRecord::Migration
  def up
    ActiveRecord::Base.connection.execute("ALTER TABLE places ALTER COLUMN authoritative_boundary DROP NOT NULL")

    path = Rails.root.join('db/sql/places.sql')
    raw_sql = File.read(path)
    ActiveRecord::Base.connection.execute(raw_sql)
  end

  def down
    ActiveRecord::Base.connection.execute("ALTER TABLE places ALTER COLUMN authoritative_boundary SET NOT NULL")
    ActiveRecord::Base.connection.execute("drop function place_calculate_boundary(geometry, geometry);")
  end

end
