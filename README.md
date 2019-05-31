use Terminal/CMD
1. Do "docker-compose up" to start docker container.
2. When docker containers work correctly:
    - Do "docker exec -it jobs4all_nginx_node bash" to exec into nginx-node container
    - In nginx-node container, do "npm install" to install nodejs module
    - Next, do "node app.js" to start app.
    - Access url "http://localhost:8080/" to enter app's homepage.