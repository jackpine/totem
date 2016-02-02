When(/^I submit my proper credentials$/) do

  # manually drop the database before running this
  touch("webView css:'#user_email'")

  wait_for_keyboard
  keyboard_enter_text 'testuser@gmail.horse'

  touch("webView css:'#user_password'")
  keyboard_enter_text 'anyanyany'

  touch("webView css:'#user_password_confirmation'")
  keyboard_enter_text 'anyanyany'

  if [true, false].sample
    tap_keyboard_action_key
  else
    touch("webView css:'input[type=\"submit\"]'")
  end

end
