class UpdateDistanceRelevanceFunc < ActiveRecord::Migration
  def up
    # use new distance-relevance model (fixing old mistake)
    # clarify the effects of peak-ahead weights
    path = Rails.root.join('db/sql/relevance.sql')
    raw_sql = File.read(path)
    ActiveRecord::Base.connection.execute(raw_sql)
  end

  def down
    ActiveRecord::Base.connection.execute("drop function relevance(float, integer, float); drop function category_relevance(int); drop function distance_relevance(float, float)")
  end

end
