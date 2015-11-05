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
    super(only: [:name, :id, :category_id])
  end

  def authoritative?
    !!is_authoritative
  end

  def imported?
    !import_source.blank?
  end
end
