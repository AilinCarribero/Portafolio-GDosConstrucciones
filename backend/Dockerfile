FROM node:14

COPY ["package.json", "/app/backend/"]

WORKDIR /app/backend/

ENV DB_HOST=mysql
ENV DB_PORT=3306
ENV DB_PASSWORD=user.admin.gdc.db
ENV DB_USER=root
ENV DB_NAME=gdosconstruccionesdb

ENV JWT_SECRET=scg2csecretpassword
ENV JWT_TIME_EXPIRED=7d
ENV JWT_COOKIE_EXPIRED=90
ENV PORT=5001

RUN npm install --save

COPY [".", "/app/backend/"]

EXPOSE 5001

#CMD ["npm", "run" ,"devstart"]
CMD [ "node", "index.js" ]