FROM node:alpine
WORKDIR /api
COPY ./ ./
COPY ./.env ./.env
RUN npm i
CMD ["node", "server.js"]