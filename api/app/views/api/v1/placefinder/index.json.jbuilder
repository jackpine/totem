json.places do
  json.array! @places, partial: 'api/v1/placefinder/place', as: :place
end
