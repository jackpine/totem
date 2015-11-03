class Place < ActiveRecord::Base
  validates :name, presence: true
  enum category: {
    "continent": 1,
    "country": 2,
    "region": 3,
    "county": 4,
    "locality": 5,
    "neighborhood": 6,
  }
  validates :is_authoritative, inclusion: {in:[true, false]} , on: :create
  validates :category, presence: true
  validates :authoritative_boundary, presence: true, if: :authoritative?
  validates :import_metadata, presence: true, if: :imported?

  def category_id
    Place.categories[self.category]
  end

  def as_json
    super(only: [:name, :id], methods: [:category_id])
  end

  def authoritative?
    !!is_authoritative
  end

  def imported?
    !import_source.blank?
  end
end
