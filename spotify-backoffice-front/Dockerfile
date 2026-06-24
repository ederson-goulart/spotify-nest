FROM node:22.15.0-alpine3.21 AS development
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

FROM development AS build
RUN npm run build

FROM node:22.15.0-alpine3.21 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/src ./src
EXPOSE 3000
CMD ["npm", "run", "start"]