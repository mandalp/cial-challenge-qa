FROM cypress/included:13.6.0

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npx", "cypress", "run"]