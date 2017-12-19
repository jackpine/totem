require 'open-uri'
require 'database_task'

namespace :totem do
  desc "list imports and their coverage of the database"
  task import_statistics: :environment do

    rows = ActiveRecord::Base.connection.execute('SELECT DISTINCT imported_at_timestamp FROM places ORDER BY imported_at_timestamp DESC;')
    import_ids = rows.map {|row| row["imported_at_timestamp"] }

    all_places_count = ActiveRecord::Base.connection.execute('select count(*) from places;')[0]['count']

    puts "\nImport Statistics"
    puts "=================\n\n"

    import_ids.each do |import_id|
      sql = <<SQL
        SELECT count(*) FROM places WHERE imported_at_timestamp = #{import_id};
SQL
      res = ActiveRecord::Base.connection.execute(sql)
      import_updated_count = res[0]['count']
      puts "#{import_id}: updated #{import_updated_count} / #{all_places_count} places, #{(100 * (import_updated_count / all_places_count.to_f)).round(2)} % "
    end


  end

end
