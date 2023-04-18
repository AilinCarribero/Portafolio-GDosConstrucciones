FROM node:18.12

WORKDIR /app/cuerre/

COPY ["package.json", "package-lock.json" , "/app/cuerre/"]

ENV REACT_APP_REST=https://gestion.gdosconstrucciones.com.ar/api/
ENV PORT=3002

RUN npm install
 
COPY [".", "/app/cuerre/"]

EXPOSE 3002

#RUN CI= npm run build

#CMD [ "react-scripts", "build" ]
CMD ["npm", "start"]

#CMD ["npm", "run", "build"]

