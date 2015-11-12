class AddBoundaryToPlace < ActiveRecord::Migration
  def up
    add_column :places, :boundary, :multi_polygon, srid: 4326
    query = <<EOF
      UPDATE places
      SET boundary=subquery.authoritative_boundary
      FROM (SELECT id, authoritative_boundary from places) AS subquery
      WHERE places.id = subquery.id
EOF
    ActiveRecord::Base.connection.execute(query)
    ActiveRecord::Base.connection.execute("ALTER TABLE places ALTER COLUMN boundary SET NOT NULL")
  end

  def down
    remove_column :places, :boundary
  end
end
