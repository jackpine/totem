FROM phusion/passenger-ruby22:0.9.19
MAINTAINER Sam Vevang <sam.vevang@gmail.com>

ENV HOME /root

CMD ["/sbin/my_init"]

RUN rm -f /etc/service/nginx/down
RUN rm /etc/nginx/sites-enabled/default

# set up the nginx server and env config
ADD config/containers/totem-api-nginx-server.conf /etc/nginx/sites-enabled/totem-api-nginx-server.conf
ADD config/containers/totem-api-nginx-env.conf /etc/nginx/main.d/totem-api-nginx-env.conf

# Don't re-run bundle install unless Gemfile changes - otherwise if we do it
# *after* we add the app, we'll run bundle install everytime any file in the
# app changes.  Copy the Gemfile and Gemfile.lock into the image.
# Temporarily set the working directory to where they are.
WORKDIR /tmp

ADD Gemfile /tmp/Gemfile
ADD Gemfile.lock /tmp/Gemfile.lock
RUN bundle install

ADD . /home/app/totem-api
RUN chown -R app:app /home/app

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* 

WORKDIR /home/app/totem-api
RUN ./bin/rails assets:precompile
