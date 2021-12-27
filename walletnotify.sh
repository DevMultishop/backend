curl  \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "mutation { createTxidNotification(txid:\"'$1'\")}"}' \
  http://multishop-api:3333/graphql
