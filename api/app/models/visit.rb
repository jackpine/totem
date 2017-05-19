class Visit < ActiveRecord::Base
  validates :place_id, presence: true
  validates :location, presence: true

  belongs_to :place

  def self.visit_place(place, visit_params)

    visit = Visit.create(visit_params);
    if(visit.persisted? && place.non_authoritative?)
        visit.place.update_boundary_by_visits
        visit
    else
      visit
    end

  end

  def as_json
    super(only: [:id, :place_id, :location])
  end
end
