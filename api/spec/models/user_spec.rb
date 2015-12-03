require 'rails_helper'

describe User do
  describe '#auth_token_pair' do

    context "a new user is created" do
      let!(:user) { User.create!(email: "test@foo.com", password: "12345678") }
      subject { user.public_token }
      it { should_not be_nil }
    end

    context "structure of the tokens" do
      let!(:user) { User.create!(email: "test@foo.com", password: "12345678") }
      it "should produce distinct tokens" do
        expect(user.public_token).not_to eq(user.private_token)
      end

    end

  end

  describe '#find_by_public_token' do
    let!(:user) { User.create!(email: "test@foo.com", password: "12345678") }
    let(:public_token) { user.public_token }

    subject { User.find_by(public_token: public_token) }
    it { should eq user }
  end

end
