class Visit < ActiveRecord::Base
  validates :place_id, presence: true
  validates :location, presence: true

  def self.visit_place(place, visit_params)

    visit = Visit.create(visit_params);
    if(visit.persisted?)
      query = <<EOF
      UPDATE places
      SET boundary=place_calculate_boundary(subquery.authoritative_boundary, visits)
      FROM (
          SELECT places.authoritative_boundary, visits.place_id, ST_Collect(visits.location) as visits
          FROM visits
          LEFT JOIN places
          ON places.id=visits.place_id
          WHERE visits.place_id = #{ActiveRecord::Base.sanitize(place.id)}
          GROUP BY visits.location, places.authoritative_boundary, visits.place_id
         ) AS subquery
      WHERE places.id = #{ActiveRecord::Base.sanitize(place.id)}
EOF

        ActiveRecord::Base.connection.execute(query)
        visit
    else
      visit
    end

  end


  def as_json
    super(only: [:id, :place_id, :location])
  end
end
