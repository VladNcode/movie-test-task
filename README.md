# Movie-api

This is a movie api I've made as a test task

# To run this app you will need to create config.env file in root dir.

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

# If you want to build a docker container run in terminal:

```
docker build -t your_docker_account_name/app_name
```

# If you want to run a docker container:

```
docker run --name movies -p 8000:8050 -e APP_PORT=8050 your_docker_account_name/app_name
```

# API endpoints:

- Signup a user
  http://localhost:8000/api/v1/users/signup POST

Example:

```
{
	"username": "testing",
	"email": "testing@gmail.com",
	"password": "password",
	"confirmPassword": "password"
}
```

- Login
  http://localhost:8000/api/v1/users/login POST

Example:

```
{
	"email": "testing@gmail.com",
	"password": "password"
}
```

- Create a movie
  http://localhost:8000/api/v1/movies POST

Available years: 1888 - 2030
Available formats: VHS, DVD, Blu-Ray

Example:

```
{
	"title": "Movie Name",
	"year": 2022,
	"format": "DVD",
	"actors": ["John Travolta", "Danny DeVito", "Renne Russo", "Gene Hackman", "Dennis Farina"]
}
```

- Update a movie
  http://localhost:8000/api/v1/movies/id PATCH

Example:

```
{
	"title": "New Movie Name",
	"year": 1900,
	"format": "Blu-Ray",
}
```

- Get one movie:

http://localhost:8000/api/v1/movies/id GET

Example:

```
You can leave it blank
```

- Delete a movie

http://localhost:8000/api/v1/movies/id DELETE

Example:

```
You can leave it blank
```

- Get a movies list

http://localhost:8000/api/v1/movies/query GET

Query options:

```
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

- Import movies

http://localhost:8000/api/v1/movies/import POST

```
This needs to be form data with value: movies and a txt file

You can find txt file example in root dir "sample.txt"
```
