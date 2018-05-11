FROM node:6.9
WORKDIR /nodejs_apps/nodejs_flavour
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8888
CMD [ "npm", "start" ]