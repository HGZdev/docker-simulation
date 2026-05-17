FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY frontend/package.json ./frontend/package.json
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--workspace", "@docker-simulation/frontend", "--", "--host", "0.0.0.0"]
