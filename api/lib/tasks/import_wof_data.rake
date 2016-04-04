require 'open-uri'
require 'database_task'

namespace :totem do
  desc "Import the whosonfirst public dataset"
  task import_wof_data: :environment do

    data_path = ENV['WOF']

    if data_path && File.exist?(data_path)
      puts "Begin database task,  **ensure you have git lfs installed and all files checked out**"
      DatabaseTask.exec('import_wof_data', [data_path])
    else
      puts 'set `WOF=/path/to/whos-on-first/data/` '
    end


  end

end
