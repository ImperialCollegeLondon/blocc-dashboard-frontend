# BLOCC Dashboard Frontend

This is the React JS frontend for the dashboard for BLOCC project

## Start Developing

The backend server endpoint has to be provided via `REACT_APP_API_ENDPOINT` environmental variable. Also, the frontend syncs with the backend via polling as of the time being, and therefore the polling frequency (in milliseconds) should be provided via `REACT_APP_POLL_INTERVAL`. [.env.development](./.env.development) file defines these variables, which can be change to adapt to one's development settings.

Before running the development server, please install the dependencies via `yarn install`.

To start the development server, run `yarn start`.

To create a production build, please supply the prescribed environmental variables and run `yarn build`.

## Run with Docker

The web app can be run with Docker. The built image `ghrc.io/imperialcollegelondon/blocc-dashboard-frontend:master` prepares a **pre-build** environment for building and serving the frontend since the prescribed environmental variables are not available at the build-time of the Docker image. Therefore, please supply these when running the Docker container so that the actual React web app can be built correctly within the container and run afterward.
