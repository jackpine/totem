FROM phusion/passenger-ruby22:latest
MAINTAINER Sam Vevang <sam.vevang@gmail.com>

ENV HOME /root

CMD ["/sbin/my_init"]

RUN rm -f /etc/service/nginx/down
RUN rm /etc/nginx/sites-enabled/default

ADD config/containers/totem-api-nginx-server.conf /etc/nginx/sites-enabled/totem-api-nginx-server.conf
ADD config/containers/totem-api-nginx-env.conf /etc/nginx/main.d/totem-api-nginx-env.conf

# install some niceities
RUN sudo apt-get update
RUN apt-get install -y postgresql-client

# Don't re-run bundle install unless Gemfile changes - otherwise if we do it
# *after* we add the app, we'll run bundle install everytime any file in the
# app changes.  Copy the Gemfile and Gemfile.lock into the image.
# Temporarily set the working directory to where they are.
WORKDIR /tmp

ADD Gemfile /tmp/Gemfile
ADD Gemfile.lock /tmp/Gemfile.lock
RUN bundle install

ADD . /home/app/totem-api
# Copy over template env file
ADD .env-template /home/app/totem-api/.env
RUN chown -R app:app /home/app

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* 
