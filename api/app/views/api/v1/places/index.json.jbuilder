json.places do
  json.array!(@places) do |place|
      json.extract! place, :id, :name, :distance, :relevance, :category_id, :category, :max_width
  end
end
