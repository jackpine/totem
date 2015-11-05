class RenamePlaceCategoryToCategoryId < ActiveRecord::Migration
  def change
    rename_column :places, :category, :category_id
  end
end
