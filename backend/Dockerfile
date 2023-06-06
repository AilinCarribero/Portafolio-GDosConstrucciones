FROM node:14

COPY ["package.json", "/app/backend/"]

WORKDIR /app/backend/

ENV DB_HOST=mysqlgdc
ENV DB_PORT=3306
ENV DB_PASSWORD=user.gdc.db
ENV DB_USER=root
ENV DB_NAME=gdcdb

ENV JWT_SECRET=secreto
ENV JWT_TIME_EXPIRED=7d
ENV JWT_COOKIE_EXPIRED=90
ENV PORT=5001

RUN npm install --save

COPY [".", "/app/backend/"]

EXPOSE 5001

#CMD ["npm", "run" ,"devstart"]
CMD [ "node", "index.js" ]