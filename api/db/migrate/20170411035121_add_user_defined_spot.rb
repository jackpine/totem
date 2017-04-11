class AddUserDefinedSpot < ActiveRecord::Migration
  def up
    path = Rails.root.join('db/sql/relevance.sql')
    raw_sql = File.read(path)
    ActiveRecord::Base.connection.execute(raw_sql)
  end

  def down
    ActiveRecord::Base.connection.execute("drop function category_relevance(category int);")
  end
end
