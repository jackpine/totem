class RemoveDuplicateMessages < ActiveRecord::Migration
  def change

    (1..13).each do |i|

      # remove the duped messages
      ActiveRecord::Base.connection.execute("Delete from messages where id in ( select id from messages where id=#{i} limit 1) ;")

    end

    # ensure there is a primary key on the messages
    ActiveRecord::Base.connection.execute("ALTER TABLE ONLY messages ADD CONSTRAINT messages_pkey PRIMARY KEY (id);")

  end
end
