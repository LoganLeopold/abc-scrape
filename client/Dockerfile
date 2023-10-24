FROM node:alpine
WORKDIR /client
COPY ./ ./
RUN npm install --package-lock-only
CMD ["npm", "run", "start"]