class Api::V1::MessagesController < Api::V1::BaseController

  before_filter :find_place

  include Location

  def index
    @messages = @place.messages.order('created_at DESC')
    respond_to do |format|
      format.json do
        render 'messages/index', status: :ok
      end
    end
  end

  def create
    @message = Message.create(new_message_params)

    respond_to do |format|
      if @message.persisted?
        format.json do
          render 'messages/show', status: :created
        end
      else
        format.json do
          render json: { error: { message: @message.errors.full_messages.join(',') }},
                 status: :unprocessable_entity
        end
      end
    end
  end

  private

  def find_place
    @place = Place.find(params.require(:place_id))
  end

  def new_message_params
    visit = Visit.find(params.require(:message).require(:visit_id))
    new_message_params = params.require(:message)
      .permit(:subject, :body, :place_id, :visit_id, location: [:type, coordinates: []])
    new_message_params
      .merge(location_params(new_message_params))
      .merge({place: @place,
              user: current_user,
              visit: visit
             })
  end

end

