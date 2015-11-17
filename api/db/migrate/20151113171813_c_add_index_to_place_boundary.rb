class CAddIndexToPlaceBoundary < ActiveRecord::Migration
  def change
    add_index :places, :boundary, using: :gist
  end
end
