# This repo is deprecated. The repo has been moved and is active at https://github.com/sparebank1utvikling/krokelo

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Local db setup

To run the app locally first you need a database to connect to.

### Spin up the postgres database image

`docker run --name postgres16 -e POSTGRES_DB=railway -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=666 -p 5432:5432 -d postgres:16`

### Add a .env file locally to define the DATABASE_URL

`DATABASE_URL="postgresql://postgres:666@localhost:5432/railway"`

### Use prod data in local dev

There is a backup of the production data included in this project in the db_backups folder.
You can use this to get a more realistic dev env.
You can restore the backup data to your local db instance in pgadmin4 or via terminal:

```sh
docker cp db_backups/10feb2024.sql {container_id}:/10feb2024.sql
docker exec -i postgres16 pg_restore -U postgres -d railway 10feb2024.sql
```

### Run prisma migration

`npm run setup:db`

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
