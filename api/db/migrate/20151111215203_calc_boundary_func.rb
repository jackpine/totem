class CalcBoundaryFunc < ActiveRecord::Migration
  def up
    path = Rails.root.join('db/sql/places.sql')
    raw_sql = File.read(path)
    ActiveRecord::Base.connection.execute(raw_sql)
  end

  def down
    ActiveRecord::Base.connection.execute("drop function place_calculate_boundary(geometry, geometry);")
  end
end
