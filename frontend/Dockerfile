FROM node:20-alpine

WORKDIR /front

COPY package.json .

EXPOSE 3000

RUN npm --proxy http://35.185.196.38:3128 install  --legacy-peer-deps

COPY . .

CMD ["npm", "run", "dev"]

# FROM node:18-alpine

# WORKDIR /react-vite-app


# COPY package.json package-lock.json ./

# RUN npm i

# COPY . ./

# CMD ["npm", "run", "dev"]