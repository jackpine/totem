class Place < ActiveRecord::Base
  validates :name, presence: { strict: true }
  validates :is_authoritative, inclusion: {in:[true, false]} , on: :create
  validates :authoritative_boundary, presence: true, if: :authoritative?
  validates :import_metadata, presence: true, if: :imported?

  def authoritative?
    !!is_authoritative
  end

  def imported?
    !import_source.blank?
  end
end
