PLACE_CATEGORIES =   ActiveSupport::HashWithIndifferentAccess.new({
  continent: 1,
  country: 2,
  region: 3,
  county: 4,
  locality: 5,
  neighborhood: 6,
})

class Place < ActiveRecord::Base
  validates :name, presence: true
  validates :is_authoritative, inclusion: {in:[true, false]} , on: :create
  validates :category_id, inclusion: {in:PLACE_CATEGORIES.values()}
  validates :category_id, presence: true
  validates :authoritative_boundary, presence: true, if: :authoritative?
  validates :import_metadata, presence: true, if: :imported?

  def self.nearby(lon, lat, radius_dregrees)
    my_loca_sql = "ST_GeomFromText('POINT(#{lon} #{lat})', 4326)"
    distance_sql = "ST_Distance(authoritative_boundary, #{my_loca_sql}, true)"
    within_sql = "ST_DWithin(#{my_loca_sql}, authoritative_boundary, #{radius_dregrees})"
    width_sql = "ST_Length(ST_LongestLine(authoritative_boundary, authoritative_boundary), true)"

    select_sql = <<EOL
    id, name, category_id, authoritative_boundary as poly,
    #{distance_sql} as distance,
    #{width_sql} as max_width,
    relevance(#{distance_sql}, category_id, #{width_sql}) as relevance
EOL

    Place
      .select(select_sql)
      .where(within_sql)
      .order("relevance DESC, category_id DESC, name ASC");

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
