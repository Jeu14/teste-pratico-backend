echo "Waiting for database..."
while ! nc -z database 3306; do   
  sleep 1
done
echo "Database available"

echo "Running migrations..."
npx node ace migration:run

echo "Running seeders..."
npx node ace db:seed

echo "Server starting..."
node ace serve --watch
