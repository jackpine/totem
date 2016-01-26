FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "user-#{n}@gmail.horse" }
    password "some-password"
  end
end
