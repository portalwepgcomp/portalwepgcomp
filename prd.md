### Deploy


#### Deploy geral

```
git push -f <BACKEND_REMOTE> <BRANCH>:master
```

#### Deploy backend

```
git push -f <BACKEND_REMOTE> <BRANCH>:master
```

---
### Banco de Dados

#### Rodar Migrations

```
ssh -t -p <PORT> <USER>@<HOST> run <BACKEND_APP> npx prisma migrate deploy
```

#### PSQL

```
ssh -t -p <PORT> <USER>@<HOST> postgres:connect <DB_SERVICE>
```


```
\dt -> Lista tabelas
\d -> Descreve tabela
\q -> quit
```

### Unlocks


#### Unlock frontend
```
ssh -t -p <PORT> <USER>@<HOST> apps:unlock <FRONTEND_APP>
```

#### Unlock backend

```
ssh -t -p <PORT> <USER>@<HOST> apps:unlock <BACKEND_APP>
```

#### LS

```
ssh -t -p <PORT> <USER>@<HOST> run <BACKEND_APP> ls -la /app/storage
```
