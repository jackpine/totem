class Place < ActiveRecord::Base
  validates :name, presence: true, on: :create
  validates :authoritative, inclusion: {in:[true, false]} , on: :create
  validates :authoritative_boundary, presence: true, if: :authoritative?
  validates :import_metadata, presence: true, if: :imported?

  def authoritative?
    !!authoritative
  end

  def imported?
    !import_source.blank?
  end
end
