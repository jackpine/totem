PLACE_CATEGORIES =   ActiveSupport::HashWithIndifferentAccess.new({
  continent: 1,
  country: 2,
  region: 3,
  county: 4,
  locality: 5,
  neighborhood: 6,
  spot: 7,
})

class Place < ActiveRecord::Base
  validates :name, presence: true
  validates :is_authoritative, inclusion: {in:[true, false]} , on: :create
  validates :category_id, inclusion: {in:PLACE_CATEGORIES.values()}
  validates :category_id, presence: true
  validates :boundary, presence: true
  validates :import_metadata, presence: true, if: :imported?

  has_many :visits
  has_many :messages

  def self.nearby(lon, lat, radius_dregrees)
    my_loca_sql = "ST_GeomFromText('POINT(#{lon} #{lat})', 4326)"
    distance_sql = "ST_Distance(boundary, #{my_loca_sql}, true)"
    within_sql = "ST_DWithin(#{my_loca_sql}, boundary, #{radius_dregrees})"
    width_sql = "ST_Length(ST_LongestLine(boundary, boundary), true)"

    select_sql = <<EOL
    id, name, category_id, boundary,
    #{distance_sql} as distance,
    #{width_sql} as max_width,
    relevance(#{distance_sql}, category_id, #{width_sql}) as relevance
EOL

    Place
      .select(select_sql)
      .where(within_sql)
      .order("relevance DESC, category_id DESC, name ASC");

  end

  def self.create_at_location(place_params, location_params)

    place = Place.new(place_params)
    place.is_authoritative = false
    location = location_params[:location]

    query = <<SQL
    SELECT ST_AsText(place_calculate_boundary) as boundary
    FROM place_calculate_boundary(NULL, ST_GeomFromText('#{location}'));
SQL
    result = connection.execute(query)
    place.boundary = result[0]['boundary']

    Place.transaction do
        place.save()
        Visit.create(place_id: place.id, location: location)
    end

    place

  end

  def self.categories
    PLACE_CATEGORIES
  end

  def category=(name)
    self[:category_id] = Place.categories[name]
  end

  def category
    Place.categories.invert()[category_id]
  end

  def as_json
    super(only: [:name, :id, :category_id], methods: [:category])
  end

  def authoritative?
    !!is_authoritative
  end

  def imported?
    !import_source.blank?
  end
end
