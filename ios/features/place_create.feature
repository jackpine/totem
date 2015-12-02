Feature: Place finding
  Users should be able to create a new place
  Users should be able to join an existing places

Scenario: Creating a place
  Given I am on the Welcome Screen
  Then I wait to see "Place Create Icon"
  Then I touch "Place Create Icon"
  Then I wait to see "Create a New Place"
  Then I wait to see "Establish this Place"
  Then I fill in "Place Create Input" with "fo"
  Then I touch "Place Create Submit"
  Then I wait to see "Place Name must be at least 3 characters."
  Then I fill in "Place Create Input" with "otch"
  Then I touch "Place Create Submit"
  Then I wait to see "Congrats, You are in footch"
