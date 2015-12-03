class ApplicationController < ActionController::Base
  # Don't do regular CSRF protection over the json API, rather just ignore the entire session
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json' }
  respond_to :html, :json

  before_action :authenticate_user!

  def after_sign_in_path_for(resource)
    stored_location_for(resource) || auth_token_pairs_me_path
  end

  rescue_from CanCan::AccessDenied do |exception|
    if current_user
      redirect_to root_url, :flash => { :alert => "You are not authorized to access that page" }
    else
      redirect_to sign_in_url
    end
  end

end
