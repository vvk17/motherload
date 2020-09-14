FROM node
COPY app.js .
COPY package.json .
RUN npm install
EXPOSE 8000
CMD node app.js
