class User < ApplicationRecord

  before_save :ensure_auth_token_pair!

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def ensure_auth_token_pair!
    return unless private_token.nil? || public_token.nil?
    generate_tokens!
  end

  def generate_tokens!
    self.private_token = friendly_token_for(:private_token)
    self.public_token = friendly_token_for(:public_token)
  end

  def friendly_token_for(attr)
    loop do
      token = Devise.friendly_token
      break token unless User.find_by(attr => token)
    end
  end

end
