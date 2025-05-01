# Etap 1: Budowanie aplikacji
FROM node:18 AS builder

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki package.json i package-lock.json
COPY package.json package-lock.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj pozostałe pliki projektu
COPY . .

# Zbuduj aplikację
RUN npm run build

# Etap 2: Serwowanie aplikacji za pomocą nginx
FROM nginx:1.23

# Usuń domyślną konfigurację nginx
RUN rm /etc/nginx/conf.d/default.conf

# Skopiuj własną konfigurację nginx
COPY nginx.conf /etc/nginx/conf.d

# Skopiuj zbudowaną aplikację do katalogu nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Eksponuj port 80
EXPOSE 80

# Uruchom nginx
CMD ["nginx", "-g", "daemon off;"]