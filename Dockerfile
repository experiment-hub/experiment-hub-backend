FROM --platform=linux/amd64 node:18.16.0

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npx prisma generate --schema=./prisma/mongo/schema.prisma
RUN npx prisma generate --schema=./prisma/postgres/schema.prisma
RUN npm run prisma:generate:db_clients
# RUN npm run prisma:postgres:dbpush
# RUN npm run prisma:mongo:dbpush
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
