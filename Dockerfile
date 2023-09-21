FROM node:alpine
WORKDIR /client
COPY public ./public
COPY package.json ./
COPY package-lock.json ./
COPY ./src ./src
COPY .env ./
RUN npm i
CMD ["npm", "run", "start"]