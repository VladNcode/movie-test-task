FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8050

EXPOSE 8050

CMD ["npm", "start"]