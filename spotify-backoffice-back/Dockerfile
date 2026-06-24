FROM node:22.15.0-alpine3.21 AS development
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM development AS build
RUN npm run build

FROM node:22.15.0-alpine3.21 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
