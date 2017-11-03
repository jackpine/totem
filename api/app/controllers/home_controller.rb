class HomeController < ApplicationController

  skip_before_action :authenticate_user!, :only => [:about, :privacy]

  def index
  end

  def about
  end

  def privacy
  end

end
