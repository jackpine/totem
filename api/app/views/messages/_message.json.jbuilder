json.id message.id
json.body message.body
json.user_id message.user_id
json.location RGeo::GeoJSON.encode(message.location)
json.place_id message.place_id
json.place message.place.as_json
