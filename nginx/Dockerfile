FROM nginx:1.22

#RUN mkdir -p /usr/share/nginx/html

#COPY --from=g2construcciones-reactjsapp ["/app/frontend/build", "/user/share/nginx/html"]

COPY [".", "/etc/nginx/"]

WORKDIR /etc/nginx/
EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]