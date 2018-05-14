FROM amd64/node:6.14.2
WORKDIR /nodejs_apps/profiler_cabinet
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8888
CMD [ "npm", "start" ]