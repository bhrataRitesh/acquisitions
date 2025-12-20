# --------------------
# Base dependencies layer
# --------------------
FROM node:lts-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci && npm cache clean --force


# --------------------
# Development image
# --------------------
FROM node:lts-alpine AS development

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000
CMD ["npm", "run", "dev"]


# --------------------
# Production image
# --------------------
FROM node:lts-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',(res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["npm", "start"]
