FROM node:18

WORKDIR /app/frontend/

COPY ["package.json", "package-lock.json" , "/app/frontend/"]

ENV REACT_APP_REST=https://gestion.gdosconstrucciones.com.ar/api/

RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm install -d
 
COPY [".", "/app/frontend/"]

EXPOSE 3000

#RUN CI= npm run build

#CMD [ "react-scripts", "build" ]
CMD ["npm", "start"]

#CMD ["npm", "run", "build"]

