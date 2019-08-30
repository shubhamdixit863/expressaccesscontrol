# Express Access Control

Its a express middleware module that provides you clean interface to use access control in your application

## Usage
```python
let express = require('express');
let app = express();
let access = require("./index");
let session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true

}))
let roles = [{
  "url": "/admin",
  allowedroles: ["admin"]
}, {
  "url": "/index",
  allowedroles: ["user", "admin"]
}, {
  "url": "/user",
  allowedroles: ["user"]
}, {
  "url": "/",
  allowedroles: []
}]

app.use(access.configure(roles));

app.get("/", (req, res) => {
  req.session["role"] = "admin";
  console.log(req.session["role"])
  res.send("Welcome to home page ,you are role is now set to " + req.session["role"])
})


app.get("/index", (req, res) => {

  res.send("hello world")
})


app.get("/user", (req, res) => {
  res.send("hello world")
})

app.get("/user/home", (req, res) => {
  res.send("hello user home")
})

app.get("/admin", (req, res) => {
  res.send("Admin Hello World")
})

app.get("/admin/home", (req, res) => {
  res.send("Admin Hello  home")
})


app.listen("3000", () => {
  console.log("Server Started");
})
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
