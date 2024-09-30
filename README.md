## JWT starter

after cloning:

- create a .env file with: 
    - AUTH_SECRET='some secret' This is gonna be your passport secret key
    - DB_STRING='mongodb://' This is your mongoDB
    
- run `npm i`
- run `npm start`

### Usage

This app will run in localhost:3001. In POST users/register route, post a new user in
json format with the following atributes:
```
{
    username: 'username',
    password: 'password'
}
```
Then, login this user in POST users/login route, you will receive the JWT<br>
Now, you can access GET users/protected route