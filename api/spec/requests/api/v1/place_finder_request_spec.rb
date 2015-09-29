require 'rails_helper'

describe 'placefinder requests' do

  describe 'GET /api/v1/placefinder.json' do
    it 'returns a list of places' do
      get "/api/v1/placefinder.json", nil, {}
      expect(response).to be_success
    end

  end

end
