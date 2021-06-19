# Visor - Personal Home Dashboard

![Visor Screenshot](https://user-images.githubusercontent.com/7339800/109727182-ba755900-7b68-11eb-8a54-24a2710eec46.png)

## Features

* Live indoor/outdoor particulate matter monitoring (PM1.0, PM2.5, PM100)
* Live updates for CO2, Temperature, VOC, IAQ, and Relative Humidity
* [CoAP](https://github.com/glenndehaan/ikea-tradfri-coap-docs) control for smart plugs and lights
* Persistent history of sensor data with adjustable timescales
* GraphQL server (with [playground](https://github.com/graphql/graphql-playground))

## Hardware Requirements

* This app relies on a sensor connected over serial (which means that running the server needs to have privileged access for reading the serial port file). It doesn't exactly matter what sensor you use, only that the hardware spits out newline-separated strings like:

```
{"pm10":5,"pm25":3,"pm100":8}
{"pm10":6,"pm25":4,"pm100":7}
{"pm10":5,"pm25":3,"pm100":9}
```

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
npm run migrate-dev
npm run migrate-prod

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
