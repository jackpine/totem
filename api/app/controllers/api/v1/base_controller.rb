class Api::V1::BaseController < ApplicationController

  skip_before_filter :authenticate_user!

  rescue_from(ActionController::ParameterMissing) do |parameter_missing_exception|
    error = {}
    error[parameter_missing_exception.param] = ['parameter is required']
    response = { errors: [error] }
    respond_to do |format|
      format.json { render json: response, status: :bad_request }
    end
  end

end
