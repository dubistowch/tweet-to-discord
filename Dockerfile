FROM buildkite/puppeteer:latest
USER root
RUN mkdir -p /app /var/www /usr/local/lib/node_modules && \
    chown -R www-data:www-data /app /var/www /usr/local/lib/node_modules

WORKDIR /app

RUN npm install -g forever

USER www-data

RUN npm install puppeteer@1.20.0 puppeteer-core@1.20.0

COPY package* /app/
RUN npm install

COPY *.js /app/

ENV HOST 0.0.0.0
ENV PORT 3000
ENV TZ Asia/Taipei

CMD fc-cache -f && forever -c 'node --harmony' /app/server.js
