sudo docker container stop client-dash-be
sudo docker container remove client-dash-be
sudo docker build -t client-dash-be . # --no-cache
sudo docker run -d -p 4000:4000 --name client-dash-be client-dash-be