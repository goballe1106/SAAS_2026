FROM node:20-alpine

WORKDIR /app

RUN npm install -g pm2

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
