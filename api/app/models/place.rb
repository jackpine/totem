class Place < ActiveRecord::Base
  validates :name, presence: true
  enum category: {
    "continent": 1,
    "country": 2,
    "region": 3,
    "county": 4,
    "locality": 5,
    "neighbourhood": 6,
  }
  validates :is_authoritative, inclusion: {in:[true, false]} , on: :create
  validates :category, presence: true, if: :authoritative?
  validates :authoritative_boundary, presence: true, if: :authoritative?
  validates :import_metadata, presence: true, if: :imported?

  def authoritative?
    !!is_authoritative
  end

  def imported?
    !import_source.blank?
  end
end
