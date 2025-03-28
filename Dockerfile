FROM nginx:alpine

# Copy the built static files to the nginx html directory
COPY dist/ /usr/share/nginx/html/

# Copy a custom nginx configuration that serves on port 3049
RUN echo 'server { \
    listen 3049; \
    root /usr/share/nginx/html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 3049
EXPOSE 3049

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]