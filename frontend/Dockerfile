FROM node:18

WORKDIR /app/frontend/

COPY ["package.json", "package-lock.json" , "/app/frontend/"]

ENV REACT_APP_REST=https://gestion.gdosconstrucciones.com.ar/api/
 
RUN npm ci
RUN echo "-------------npm install completed successfully"

COPY [".", "/app/frontend/"]

#RUN npm run build
#RUN echo "--------------------npm run build completed successfully"

EXPOSE 3000

#CMD [ "react-scripts", "build" ]
CMD ["npm", "run", "devstart"]

#CMD ["npm", "run", "build"]

