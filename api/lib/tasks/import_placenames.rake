require 'open-uri'
require 'flickr_woe_importer'

@data_path = Rails.root.join('tmp/data_import')

def ensure_directory(path)
  FileUtils::mkdir_p(path)
end

def download_data_and_extract(name, url)
  cache_locally = ENV['CACHE']
  puts "getting '#{name}'"
  file_location = @data_path.join(name)
  if(cache_locally && File.exist?(file_location) )
    puts "dicovered cached file: #{name}"
    system("cd #{@data_path} && ls -lk #{name}")
  else
    puts "fetching from web"
    data = open(url).read
    data.force_encoding('UTF-8')
    File.open(file_location, 'w') {|f| f.write(data) }
  end

  puts "extracting tarball"
  if !system("cd #{@data_path} && tar -xvf #{name}")
    abort("could not extract #{name} in #{@data_path}")
  end
  Dir::glob(@data_path.join("*.geojson"))
end

namespace :totem do
# http://code.flickr.net/2011/01/08/flickr-shapefiles-public-dataset-2-0-1
  desc "Import the flickr shapefiles public dataset"
  task import_flickr_data: :environment do
    ensure_directory(@data_path)

    name = "flickr_shapes_public_dataset_2.0.1.tar.gz"
    json_paths = download_data_and_extract(name, 'https://s3.amazonaws.com/totem-placefinder/flickr_shapes_public_dataset_2.0.1.tar.gz')
    puts "Begin loading"
    FlickrWOEImporter.process(json_paths)


  end

end
