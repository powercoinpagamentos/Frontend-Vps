# Etapa de build
FROM node:20-alpine as builder

USER root
RUN apk add --no-cache bash

WORKDIR /app

# Variáveis de ambiente no build
ARG REACT_APP_GENERATE_SOURCEMAP
ENV REACT_APP_GENERATE_SOURCEMAP=$REACT_APP_GENERATE_SOURCEMAP
ARG REACT_APP_SERVIDOR
ENV REACT_APP_SERVIDOR=$REACT_APP_SERVIDOR
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ARG REACT_APP_CI
ENV REACT_APP_CI=$REACT_APP_CI
ARG PORT
ENV PORT=$PORT

# Copia arquivos do projeto
COPY package*.json ./
COPY public/ ./public/
COPY src/ ./src/

# Instala dependências
RUN npm install --legacy-peer-deps --fetch-retries=10 --fetch-retry-maxtimeout=120000 --audit=false --fund=false

# Gera o build
RUN npm run build

# Etapa final com Nginx
FROM nginx:1.25-alpine

RUN apk add --no-cache curl

# Copia build gerado
COPY --from=builder /app/build /usr/share/nginx/html

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
