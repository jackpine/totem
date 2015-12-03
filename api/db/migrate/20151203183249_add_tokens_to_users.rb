class AddTokensToUsers < ActiveRecord::Migration
  def change
    add_column :users, :public_token, :string, :null => false
    add_column :users, :private_token, :string, :null => false
    drop_table :auth_token_pairs
  end
end
