class AddTypeToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :category, :integer
  end
end
