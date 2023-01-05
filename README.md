# Bonk Space Backend

## Docker Comands

docker build -t bonk-space-backend .
docker run -it -p 9000:8000 -v $(pwd):/app bonk-space-backend

## Steps

1. docker build -t bonk-space-backend .
2. docker run -it -p 9000:8000 -v $(pwd):/app bonk-space-backend
3. ( on another terminal ) nrok http 8000
