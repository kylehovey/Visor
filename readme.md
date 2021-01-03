# React App Boilerplate

![Node.js CI](https://github.com/kylehovey/Visor/workflows/Node.js%20CI/badge.svg)

This is a boilerplate setup for a React app with a Node.js back-end with a pre-configured GraphQL API with Websocket subscriptions set up. I am following this mantra:

* Make the setup as simple as possible
* Make the setup maintainable and flexible for future modifications
* Choose ones with active maintenance
* Choose ones with comprehensive documentation
* Whenever possible, use libraries, not custom toolings

So far, this project is more-or-less 100% standard, with only the directory structure being unique to this project. This repo serves mainly as a starting point so that you don't have to spend hours setting up your React/Express/ORM/API/Websocket stack. This boilerplate is also production-ready.

## Features

* React development server
* Express back-end
* Apollo GraphQL server with an example schema set up
* Sequelize ORM as a PostgreSQL connector supplied as context to Apollo GraphQL
* GraphQL subscriptions set up and working out-of-the-box
* A publisher model for broadcasting arbitrary events over GraphQL subscriptions
* [dotenv-flow](https://www.npmjs.com/package/dotenv-flow) for both server and client
* Script to run back-end with `nodemon` and front-end with `react-scripts` for hot-reloading on both sides
* One simple script to compile a production client build and serve it from express

## Development

First, clone this repo and `cd` into the directory. I use the [asdf Version Manager](https://asdf-vm.com/) to manage my runtime environments. Once in the directory, just run `asdf install` to ensure that you have the right runtimes. If you don't use asdf, just check out `.tool-versions` for the runtimes that this project uses.

Install the command-line dependencies this project requires:

```bash
npm i -g sequelize-cli nodemon
```

Then, run `npm run setup` to install dependencies (this is just `npm i` in both dirs, but I added a script to make it easier). Once that finishes, run `npm run dbsetup` to initialize the development database and user.

Run any migrations to create the schema by running `npm run migrate-dev` and `npm run migrate-prod`.

**(Optional):** Once you have the right runtimes, copy `.env.development` in both the project root and in `client` to a `.env.development.local` for each and put any environment variables you wish to override in the new files.

To run the development stack, run `npm run server` in one tab/pane/terminal and `npm run client` in another. Both will hot-reload whenever you change any files, so no need to restart them unless you change the environment variables.

**TL;DR:**

```bash
git clone git@github.com:kylehovey/react-boilerplate.git
cd react-boilerplate
asdf install
npm i -g sequelize-cli nodemon
npm run setup
npm run dbsetup

# One tab
npm run server

# Another
npm run client
```

## Managing Live Data Publishing

If you want to broadcast data via GraphQL subscriptions, first create a publisher in `app/subscriptions/publishers` that publishes the information to a `PubSub` topic. Make sure that you add a line in `app/subscriptions/publishers/index.js` that requires your publisher. Then, in the subscription resolver, use the `pubsub` and `topics` in the context to return an async iterator for the topic you want to broadcast. A basic example that broadcasts random numbers every second is already set up.

## Testing

* Client: `npm run test`
* Server: (not implemented)

## Linter

* Server: `npm run lint`
* Client: (built into `npm run client`)

## Production

Make sure you have configured your production environment in both `.env.production.local` and `client/.env.production.local` (you will have to create these), then just run `npm run production` to compile a production build and run the full stack. Note that you won't have to run the React dev server anymore since the static bundle built by the React stack will be served statically from the same express server that runs the GraphQL endpoint.
