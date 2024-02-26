FROM node:hydrogen-alpine3.19

# Setăm directorul de lucru în interiorul containerului
WORKDIR /app

# Copiem pachetul de dependențe și fișierele necesare
COPY package.json /app/

RUN npm install

# Copiem scripturile în directorul de lucru
COPY scripts/ /app/scripts/

# Copiem codul sursă al aplicației în directorul de lucru
COPY . /app

# Expunem portul 3000 pentru a putea fi accesat
EXPOSE 3000

# Comandă pentru a porni aplicația atunci când containerul este lansat
CMD ["node", "app.js"]
