# Movie-API

This is a movie API I've made as a test task

<h2>To run this app you will need to create config.env file in root dir.</h2>

```
NODE_ENV=production
PORT=5000

JWT_SECRET=your_very_extremely_super_enormously_secret_key
JWT_EXPIRES_IN=90d

DB_NAME=prod-db
DB_USER=user
DB_PASS=pass

DB_TEST_NAME=test-db
DB_TEST_USER=test-user
DB_TEST_PASS=test-pass
```

After you have created a file you can run the app by running: npm start

<h2>If you want to build a docker container (you need to have docker installed), run the following command in terminal:</h2>

```
docker build -t your_docker_account_name/app_name
```

<h2>If you want to run a docker container:</h2>

```
docker run --name movies -p 8000:8050 -e APP_PORT=8050 your_docker_account_name/app_name
```

<h2>API endpoints:</h2>

<h3>Signup a user:</h3>

```
http://localhost:8000/api/v1/users/signup POST
{
	"username": "testing",
	"email": "testing@gmail.com",
	"password": "password",
	"confirmPassword": "password"
}
```

<h3>Login:</h3>

```
http://localhost:8000/api/v1/users/login POST
{
	"email": "testing@gmail.com",
	"password": "password"
}
```

<h2>IMPORTANT: to access the following endpoints you will need to be authorized:</h2>

```
headers:
Authorization: Bearer your_token

You can get your_token on sign up or login in a response
```

<h3>Create a movie:</h3>

```
http://localhost:8000/api/v1/movies POST

Available years: 1888 - 2030
Available formats: VHS, DVD, Blu-Ray

{
	"title": "Movie Name",
	"year": 2022,
	"format": "DVD",
	"actors": ["John Travolta", "Danny DeVito", "Renne Russo", "Gene Hackman", "Dennis Farina"]
}
```

<h3>Update a movie:</h3>

```
http://localhost:8000/api/v1/movies/id PATCH

{
	"title": "New Movie Name",
	"year": 1900,
	"format": "Blu-Ray",
}
```

<h3>Get one movie:</h3>

```
http://localhost:8000/api/v1/movies/id GET

{
You can leave it blank
}
```

<h3>Delete a movie:</h3>

```
http://localhost:8000/api/v1/movies/id DELETE

{
You can leave it blank
}
```

<h3>Get a movies list:</h3>

```
http://localhost:8000/api/v1/movies/query GET

Query options:
actor: Search by actor
title: Search by title
search AND actor: find a movie by name with an actor in it
sort: Possible values: id, title, year. Default: id
order: Possible values: ASC, DESC. Default: ASC
limit: Between 1 and 100. Default: 20
offset: Default: 0

examples:
http://localhost:8000/api/v1/movies?actor=Peter&search=Casa
http://localhost:8000/api/v1/movies?limit=50&offset=5&sort=title&order=DESC
```

<h3>Import movies:</h3>

```
http://localhost:8000/api/v1/movies/import POST

This request needs to be form data with value: movies and a txt file

You can find txt file example in root dir "sample.txt"
```
