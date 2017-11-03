# app/mailers/application_mailer.rb
class ApplicationMailer < ActionMailer::Base
  default from: 'contact@totem-app.com'
  layout 'mailer'
end
