class Message < ActiveRecord::Base

  validates :subject, :body, :user, :place, :visit, :location, presence: true

  belongs_to :user
  belongs_to :place
  belongs_to :visit

end
