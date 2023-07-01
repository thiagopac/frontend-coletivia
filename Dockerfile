### STAGE 1: Build ###
FROM registry.gitlab.com/cross-work/devops/angular:14.0.6 AS build
ARG ENV_FLAG
ENV ENV_FLAG=${ENV_FLAG:-stage}

WORKDIR /usr/src/app
COPY package.json ./

COPY . .

RUN npm install -f && \ 
    ng build --configuration=$ENV_FLAG

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
ARG ENV_NGINX
ENV ENV_NGINX=${ENV_NGINX:-nginx.conf}

COPY ${ENV_NGINX} /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
