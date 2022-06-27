# Developing

You will need to install:

- Ruby 3
- Node 16
- sqlite

Once you've installed those programs, go ahead and run:

```sh
./api/bin/initial-setup
```

Note that you only need to run this one time, after you download the repository. From there, you can test the project with:

```sh
./api/bin/test
```

You can also get the project running locally with:

```sh
./api/bin/dev
```

## Hot Reloading

For the nicest possible development experience, I suggest installing [watchexec](https://github.com/watchexec/watchexec). If you do, you can run:

```sh
./api/bin/all
```

That will spin up four processes:

- A GUI server with hot reloading for React.
- An API server that changes when you edit files for Ruby.
- A testing process that will run `./bin/rails test` whenever you edit Ruby files.
- A testing process that will run `jest --watch` inside the GUI directory.

All of the outputs will be nicely colored in a terminal for you.

## Deployment

If you want to set up your own instance of the app, I highly reccomend using a [DigitalOcean's app platform](https://www.digitalocean.com/products/app-platform). They make it really easy to connect a static website to an API, as we do here.
