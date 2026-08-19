FROM node:18-alpine
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy rest of the source
COPY . .

EXPOSE 4000
CMD ["npm", "start"]
