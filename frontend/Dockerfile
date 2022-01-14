FROM node:16
ENV PORT 3000
RUN mkdir -p /app
WORKDIR /app
COPY package*.json .
RUN npm install
COPY .env.local .
COPY components/ components/
COPY pages/ pages/
COPY public/ public/
COPY styles/ styles/
RUN npm run build
EXPOSE 3000
CMD "npm" "run" "start"
