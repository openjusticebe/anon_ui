# Stage 0, build using node
FROM node:buster-slim AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc build-essential libgl1

RUN npm install -g gatsby-cli

RUN mkdir /workdir
WORKDIR /workdir

COPY package* ./
RUN npm install

COPY ./src ./src
COPY gatsby* ./
RUN gatsby build


# Stage 1, Serve compiled pages with nginx
FROM nginx:alpine as serve

COPY --from=build /workdir/public /usr/share/nginx/html
COPY ./misc/default.conf /etc/nginx/conf.d/default.conf

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80
STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
