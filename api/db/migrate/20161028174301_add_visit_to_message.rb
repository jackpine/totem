class AddVisitToMessage < ActiveRecord::Migration
  def change
    add_column :messages, :visit_id, :integer
  end
end
