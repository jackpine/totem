class AdjustRelevance < ActiveRecord::Migration
  def up
    path = Rails.root.join('db/sql/relevance.sql')
    raw_sql = File.read(path)
    ActiveRecord::Base.connection.execute(raw_sql)
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
