FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma db push && npx prisma generate
RUN npm run build
# RUN npm i ts-node

EXPOSE 4000

CMD ["npm", "run", "start:prod"]