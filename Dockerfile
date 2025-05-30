FROM ghcr.io/puppeteer/puppeteer:24.6.1

ENV  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true  \
     PUPPETEER_EXECUTABLE_PATCH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY  package*.json ./

RUN npm ci

COPY . .

CMD ["node", "index.js"]

