class AuthoritativeBoundaryNonNullable < ActiveRecord::Migration
  def up
    ActiveRecord::Base.connection.execute("ALTER TABLE places ALTER COLUMN authoritative_boundary SET NOT NULL")
  end
  def down
    ActiveRecord::Base.connection.execute("ALTER TABLE places ALTER COLUMN authoritative_boundary DROP NOT NULL")
  end
end
