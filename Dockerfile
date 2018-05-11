FROM node:6.9
WORKDIR /root/nodejs_apps/nodejs_flavour_d
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8888
CMD [ "npm", "start" ]