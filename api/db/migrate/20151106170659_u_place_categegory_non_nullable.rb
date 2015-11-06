class UPlaceCategegoryNonNullable < ActiveRecord::Migration
  def change
    change_column :places, :category_id, :integer, null: false
  end
end
