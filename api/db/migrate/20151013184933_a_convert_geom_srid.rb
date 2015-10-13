class AConvertGeomSrid < ActiveRecord::Migration
  def up
    execute "SELECT UpdateGeometrySRID('places','authoritative_boundary', 4326);"
  end
  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
