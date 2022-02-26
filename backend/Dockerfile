FROM node:14

COPY ["package.json", "/app/backend/"]

WORKDIR /app/backend/

ENV DB_HOST=btnd44edegiz8nwzvsbs-mysql.services.clever-cloud.com
ENV DB_PORT=3306
ENV DB_PASSWORD=33R7ZgmJYbL3WbT8Jvbg
ENV DB_USER=uhho3bzq63smxbtc
ENV DB_NAME=btnd44edegiz8nwzvsbs

ENV JWT_SECRET=scg2csecretpassword
ENV JWT_TIME_EXPIRED=7d
ENV JWT_COOKIE_EXPIRED=90
ENV PORT=5001

RUN npm install -g mysql2
RUN npm install --save

COPY [".", "/app/backend/"]

EXPOSE 5001

#CMD ["npm", "run" ,"devstart"]
CMD [ "node", "index.js" ]