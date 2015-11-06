class Visit < ActiveRecord::Base
  validates :place_id, presence: true
  validates :location, presence: true

  def as_json
    super(only: [:id, :place_id, :location])
  end
end
