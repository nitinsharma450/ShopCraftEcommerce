FROM node:18

WORKDIR /app

# Copy only package files first (for better caching)
COPY package.json package-lock.json ./

RUN npm install

# Copy the rest of the project
COPY . .

EXPOSE 9999

CMD ["node", "src/index.js"]
