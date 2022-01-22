
# Memo Rap Check

Memo Rap Check is a challenge to test your Cross-Site-Scripting (XSS) skillz. In the example, Memo is represented by a puppeteer browser bot, that visits the web site regularly.

## Building/starting/stopping Memo Rap Check
This is a Docker container that contains a docker-compose file. You can build the Docker image and start the
container with the following command (in this directory):

```
sudo docker-compose up -d
```

Use the following command to stop the container (again, in this directory)

```
sudo docker compose down
```

## Task descriptions
- Browse the application. Make note of any endpoints which might process user input.
- You can find the flag within the route "/flag". Within the source code, find the reason why you can't access it.
- Within the source, find out how and by whom your inputs are processed.
- Exploit the application to retrieve the flag remotely. For debuggin purposes you **might want to temporarily patch the source**, for example by commenting out parts of the code.
