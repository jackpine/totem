class AddCategoryRelevanceLookupTable < ActiveRecord::Migration
  def up
    path = Rails.root.join('db/sql/relevance.sql')
    raw_sql = File.read(path)
    ActiveRecord::Base.connection.execute(raw_sql)
  end
  def down
    throw ActiveRecord::IrreversibleMigration
  end
end
