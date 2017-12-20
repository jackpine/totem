require 'open-uri'
require 'database_task'

namespace :totem do
  desc "list imports and their coverage of the database"
  task import_statistics: :environment do

    import_ids = Place.distinct.pluck(:imported_at_timestamp)

    all_places_count = Place.count

    puts "\nImport Statistics"
    puts "=================\n\n"

    import_ids.each do |import_id|
      import_updated_count = Place.where(imported_at_timestamp: import_id).count
      import_updated_percentage = (100 * (import_updated_count / all_places_count.to_f)).round(2)

      puts "#{import_id}: updated #{import_updated_count.to_s.rjust(7, ' ') } / #{all_places_count} places. Import coverage: #{import_updated_percentage} % "
    end


  end

end
