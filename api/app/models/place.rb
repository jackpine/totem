PLACE_CATEGORIES =   ActiveSupport::HashWithIndifferentAccess.new({
  continent: 1,
  country: 2,
  region: 3,
  county: 4,
  locality: 5,
  neighborhood: 6,
  spot: 7,
})

class Place < ApplicationRecord
  acts_as_paranoid

  validates :name, presence: true
  validates :is_authoritative, inclusion: {in:[true, false]} , on: :create
  validates :category_id, inclusion: {in:PLACE_CATEGORIES.values()}
  validates :category_id, presence: true
  validates :boundary, presence: true
  validates :import_metadata, presence: true, if: :imported?

  has_many :visits
  has_many :messages

  ST_SIMPLIFY_FACTOR = 0.01

  def self.relevant_nearby(lon, lat)

    simplified_boundary_sql = "ST_Simplify(boundary, #{ST_SIMPLIFY_FACTOR}, true)"

    Place.find_by_sql(<<SQL

    SELECT id, name, distance, category_id, max_width,
      -- category_relevance(category_id),
      -- distance_relevance(distance, max_width),
      relevance(distance, category_id, max_width)
    FROM  (
      SELECT  id, name, category_id,
      ST_Distance(#{simplified_boundary_sql}::geography, ST_GeomFromText('POINT(#{lon} #{lat})', 4326)::geography , true) as distance,
      ST_Length(ST_LongestLine(#{simplified_boundary_sql}, #{simplified_boundary_sql})::geography) as max_width

      FROM "places"
      -- find all the places within 0.1 degree of the point that intersect bboxes on boundary
      WHERE ST_Dwithin(ST_GeomFromText('POINT(#{lon} #{lat})', 4326), boundary, 0.1)
    ) q1
    order by relevance desc
    ;
SQL
)
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

  def non_authoritative?
    !authoritative?
  end

  def authoritative?
    !!is_authoritative
  end

  def imported?
    !import_source.blank?
  end

  def update_boundary_by_visits
      query = <<EOF
      UPDATE places
      SET boundary=place_calculate_boundary(subquery.authoritative_boundary, visits)
      FROM (
          SELECT places.authoritative_boundary, visits.place_id, ST_Collect(visits.location) as visits
          FROM visits
          LEFT JOIN places
          ON places.id=visits.place_id
          WHERE visits.place_id = #{self.id}
          GROUP BY visits.location, places.authoritative_boundary, visits.place_id
         ) AS subquery
      WHERE places.id = #{self.id}
EOF
      Place.connection.execute(query)
  end

end
