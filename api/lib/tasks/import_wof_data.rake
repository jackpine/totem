require 'open-uri'
require 'database_task'

@data_path = Rails.root.join('tmp/data_import')

def ensure_directory(path)
  FileUtils::mkdir_p(path)
end

def clone_repo_and_freshen(git_url)

  puts "lookup up '#{git_url}'"
  ensure_directory(@data_path)

  cache_path = ENV['CACHE']

  if(cache_path && File.exist?(cache_path) )
    if(File.exist?(cache_path))
      puts "discovered cached file: #{cache_path}"
      return File.join(cache_path, 'data')
    else
      puts "could not find file, bailing"
      return
    end
  else
    repo_path = @data_path.join('whosonfirst-data')
    if(File.exist?(repo_path) )
      `cd #{repo_path} && git pull`
    else
      puts "cloning from web"
      `git clone #{git_url} #{repo_path} --depth 1`
    end
    `cd #{repo_path} && git lfs fetch`
    `cd #{repo_path} && git lfs checkout`
    return repo_path
  end

end

namespace :totem do
  desc "Import the whosonfirst public dataset"
  task import_wof_data: :environment do
    puts "use the 'CACHE=/path/to/wof-repo' env var to speed up the clone"

    git_repo = "https://github.com/whosonfirst/whosonfirst-data"
    data_path = clone_repo_and_freshen(git_repo)
    puts "Begin database task"
    DatabaseTask.exec('import_wof_data', [data_path])

  end

end
