FROM node

WORKDIR /front

COPY package.json .

EXPOSE 3000

RUN npm i 

COPY . .

CMD ["npm", "run", "dev"]

# FROM node:18-alpine

# WORKDIR /react-vite-app


# COPY package.json package-lock.json ./

# RUN npm i

# COPY . ./

# CMD ["npm", "run", "dev"]