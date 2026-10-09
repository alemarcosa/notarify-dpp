# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm install
RUN npx prisma generate

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm install --omit=dev
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory with appropriate permissions
RUN mkdir -p /app/uploads/qrcodes && chown -R node:node /app/uploads

USER node

EXPOSE 3001

CMD [ "sh", "-c", "npx prisma db push --skip-generate && npx prisma db seed && node dist/main.js" ]
