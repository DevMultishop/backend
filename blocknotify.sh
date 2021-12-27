curl  \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "mutation { createBlockNotification(block_hash:\"'$1'\")}"}' \
  http://multishop-api:3333/graphql
