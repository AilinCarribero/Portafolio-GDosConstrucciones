FROM node:17

WORKDIR /app/cuerre/

COPY ["package.json", "package-lock.json" , "/app/cuerre/"]

ENV REACT_APP_REST=https://gestion.gdosconstrucciones.com.ar/api/
ENV PORT=3002

RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm install --save
 
COPY [".", "/app/cuerre/"]

EXPOSE 3002

#RUN CI= npm run build

#CMD [ "react-scripts", "build" ]
CMD ["npm", "start"]

#CMD ["npm", "run", "build"]

