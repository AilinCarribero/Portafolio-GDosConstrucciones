FROM node:18.12.1

WORKDIR /app/frontend/

COPY ["package.json", "package-lock.json" , "/app/frontend/"]

ENV REACT_APP_REST=https://gestion.gdosconstrucciones.com.ar/api/

RUN npm install
 
COPY [".", "/app/frontend/"]

EXPOSE 3000

#RUN CI= npm run build

#CMD [ "react-scripts", "build" ]
CMD ["npm", "start"]

#CMD ["npm", "run", "build"]

