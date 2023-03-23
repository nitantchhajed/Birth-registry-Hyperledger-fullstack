docker rm -f $(docker ps -a -q)
docker volume prune 
rm -rf ../fabric-client-kv-org1/*
rm -rf ../crypto/*
