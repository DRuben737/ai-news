

#!/bin/sh

BASE_URL="http://localhost:3000"

curl "$BASE_URL/api/fetch"

sleep 5

curl "$BASE_URL/api/top"

sleep 5

curl "$BASE_URL/api/push"