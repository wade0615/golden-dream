# Nest Starter Backend

Swagger docs are hosted in `{host}/v1/api`

## Authorization Flow. ttt

Local:

```
[POST] /v1/auth/login -> Will set cookie with accountId, Refresh (jwt), Authorization (jwt)
  * Refresh token will be stored in the database (hashed)
[POST] /v1/auth/logout -> Will expire cookies
[GET] /v1/auth/refresh -> Will update access token
[POST] /v1/auth/azure/callback -> Validates token from AzureAD and generates same access_token and refresh_token from `/v1/auth/login` flow
```


## Generators

`gen/res` - Creates a whole new endpoint with controller, service, module, dto, entity..

- If you're adding a new endpoint use this generator
- Example: `gen/res domain`

`gen/lib` - Creates a new library to be used within the project.

- If you're adding a new third party library or making a custom library use this generator
- Example: `gen/lib excel`

`gen/middleware` - Creates a new library to be used within the project.

- If you're adding a middleware use this generator
- Example: `gen/middleware request-timer`

## Help

```
help                           Shows this help
gen/res                        Generates a resource
gen/lib                        Generates a third party library
gen/middleware                 Generates a middleware
app/build                      Builds Nest App
app/install                    Installs dependencies
app/dev                        Updates internal packages, starts DB docker container and starts app in dev mode
app/start-dev                  Starts app in dev mode
app/start-prod                 Starts app in prod mode
app/stop                       Stops all docker containers
app/update-common              Updates internal packages
docker/build                   Builds docker image
docker/start-infra             Builds infra images
```
