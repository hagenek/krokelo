# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Possible Todos

- [ ] Make it possible for players to be anonymous at stats and profile page.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Local db setup

`docker run --name postgres15 -e POSTGRES_DB=krokelo -e POSTGRES_USER=wox -e POSTGRES_PASSWORD=666 -p 5432:5432 -d postgres:15`


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
