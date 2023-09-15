FROM node:18

WORKDIR /app/frontend/

COPY ["package.json", "package-lock.json" , "/app/frontend/"]

ENV REACT_APP_REST=https://gestion.gdosconstrucciones.com.ar/api/
 
RUN npm ci

COPY [".", "/app/frontend/"]

#RUN npm run build

EXPOSE 3000

#CMD ["npm", "start"]
