FROM node:alpine3.20 as build

# Build App
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

#serve with nginx
FROM nginx:1.27.0-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]