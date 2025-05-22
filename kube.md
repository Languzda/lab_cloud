Aby wystartować kubernetes:

po kolei:

`kubectl create configmap db-init-sql --from-file=./db/data/import.sql`

`kubectl apply -f .\lc-postgres.yml`

`kubectl apply -f .\lc-api.yml`

`kubectl apply -f .\lc-frontend.yml`

Aby dobić się do frontendu: `http://localhost:30002`

Aby spradzić serwisy (mozna podejrzec porty): `kubectl get services`

Aby podejrzeć stan podów: `kubectl get pods`
