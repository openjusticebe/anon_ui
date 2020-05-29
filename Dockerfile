# Stage 0, build using node
FROM node:alpine AS build

RUN \
  apk add --no-cache python make g++ && \
  apk add vips-dev fftw-dev --update-cache \
  --repository http://dl-3.alpinelinux.org/alpine/edge/community \
  --repository http://dl-3.alpinelinux.org/alpine/edge/main \
  && rm -fR /var/cache/apk/*

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
