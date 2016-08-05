class Message < ActiveRecord::Base

  validates :subject, :body, :user, :place, :location, presence: true

  belongs_to :user
  belongs_to :place

end
