FROM node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/

RUN npm install --no-optional

RUN chown -R 1001:0  /usr/src/app
USER 1001

ENV HOST 0.0.0.0
EXPOSE 3000
CMD [ "node", "./bin/www" ]
