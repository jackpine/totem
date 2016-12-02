FactoryGirl.define do
  factory :message do
    place
    visit
    body "Another fine message"
    subject "another subject"
    location "POINT (0 0)"
  end
end
