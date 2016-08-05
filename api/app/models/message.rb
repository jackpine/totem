class Message < ActiveRecord::Base

  validates :body, :user, :place, presence: true

  belongs_to :user
  belongs_to :place

end
