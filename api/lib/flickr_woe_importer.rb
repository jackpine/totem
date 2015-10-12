require 'json'

class FlickrWOEImporter
  def self.process(json_data_paths)
    count = 0
    inserted = 0
    pretend_inserted = 0
    failed_to_insert = 0
    $stdout.sync = true


    for json_path in json_data_paths do
      puts "processing #{json_path}"
      data = JSON.parse(File.read(json_path))

      ActiveRecord::Base.transaction do
        for feature in data["features"] do

          metadata = feature["properties"]
          metadata["flickr_id"] =    feature["id"];
          metadata["geometry"] = {}
          metadata["geometry"]["created"] =      feature["geometry"]["created"]
          metadata["geometry"]["alpha"] =        feature["geometry"]["alpha"]
          metadata["geometry"]["points"] =       feature["geometry"]["points"]
          metadata["geometry"]["edges"] =        feature["geometry"]["edges"]
          metadata["geometry"]["is_donuthole"] = feature["geometry"]["is_donuthole"]
          metadata["geometry"]["bbox"] =         feature["geometry"]["bbox"]

          if ENV['PRETEND']
            pretend_inserted
          else
            Place.create!(name: name,
                         is_authoritative: true, 
                         authoritative_boundary: RGeo::GeoJSON.decode(feature["geometry"]),
                         import_source: "flickr-shapefiles-2.0.1",
                         import_metadata: metadata)
            count += 1
            if(count % 1000 == 0)
              print "."
            end
          end
        end
        print "\n"
      end
    end


    if ENV['PRETEND']
      puts "Would have inserted #{pretend_inserted} places"
    else
      puts "inserted #{count} localities"
    end
    puts "Failed to insert #{failed_to_insert} places due to validation error."

  end

end
