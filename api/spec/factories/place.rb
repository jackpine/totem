FactoryGirl.define do
  factory :place do
    sequence(:name) { |n| "place-#{n}" }
    is_authoritative false
    category :neighborhood
    authoritative_boundary "MULTIPOLYGON (((35 10, 45 45, 15 40, 10 20, 35 10), (20 30, 35 35, 30 20, 20 30)))"
    boundary "MULTIPOLYGON (((35 10, 45 45, 15 40, 10 20, 35 10), (20 30, 35 35, 30 20, 20 30)))"
  end
end
