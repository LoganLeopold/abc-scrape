FROM node:alpine
WORKDIR /app
COPY ../package.json ./
COPY ../package-lock.json ./
COPY SERVER/*.js* ./
COPY ../.env ./
RUN npm i
CMD ["node", "server.js"]