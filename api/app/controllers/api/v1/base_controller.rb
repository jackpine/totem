class Api::V1::BaseController < ApplicationController

  skip_before_filter :authenticate_user!
  before_filter :authenticate_token!

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.json { render json: {errors: ['access denied']}, status: :forbidden }
    end
  end

  rescue_from(ActionController::ParameterMissing) do |parameter_missing_exception|
    error = {}
    error[parameter_missing_exception.param] = ['parameter is required']
    response = { errors: [error] }
    respond_to do |format|
      format.json { render json: response, status: :bad_request }
    end
  end

  def authenticate_token!
    decoded_params = JWT.decode(params.fetch(:jwt), 'nil', false)[0]
    @current_user = User.find_by_public_token(decoded_params['public_token'])
    raise CanCan::AccessDenied unless @current_user.present?
    params.merge!(JWT.decode(params.fetch('jwt'), @current_user.private_token, true)[0])
    true
  end

  def current_user
    @current_user
  end

end
