# Networks_Wifi_Mapper

## Database setup
docker pull mongo
docker run -d --name STL_Hacks_Container -p 5151:27017 -e MONGO_INITDB_ROOT_USERNAME= -e MONGO_INITDB_ROOT_PASSWORD= mongo
