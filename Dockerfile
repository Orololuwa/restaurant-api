FROM node:15.4
# FROM --platform=linux/amd64 linux/x86_64

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD npm run start:dev
