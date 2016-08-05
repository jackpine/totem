require 'rails_helper'

describe Message, type: :model do

  it { should belong_to(:user) }
  it { should belong_to(:place) }

  it { should validate_presence_of :user}
  it { should validate_presence_of :place}
  it { should validate_presence_of :body}

end
