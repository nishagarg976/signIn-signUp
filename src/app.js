const express = require("express");
const path = require("path");
const app = express();
const hbs  = require("hbs");
const bcrypt = require("bcryptjs")

const Register = require("./models/registers");
require("./db/conn");

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("home");
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// create new user in database
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;

    if (password === confirmPassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        country: req.body.country
      });

//befor save data in database we have to hash the password
//use middleware

// //use one more middle to jwt auth
const token = await registerEmployee.generateAuthToken();
console.log("the token is " + token)

      const registered = await registerEmployee.save();
      res.status(201).render("home");
    } else {
      res.send("Passwords are not matching");
    }
 
    console.log();
  } catch (err) {
    res.status(400).send(err);
  
  }
});



app.post("/login", async(req,res)=>{
   try{
    const loginemail = req.body.email;
    const loginpassword = req.body.password;
  
    const user = await Register.findOne({email:loginemail})

    const isMatch = await bcrypt.compare( loginpassword,user.password);
   
    const token = await user.generateAuthToken();
     console.log("the token is " + token)

    if(isMatch){  
      const naming = user.firstname
      res.status(201).render("home", { naming: user.firstname });
      // console.log(naming);
    }else{
      res.send("Wrong Details ");
    }

   }catch(err){
    res.status(400).send('Wrong Details here');
   }
})



// **************************************//
// //method of password hash

// const securePassword = async(password) =>{
//   const passwordHash = await bcrypt.hash(password,10);
//   console.log(passwordHash);

//   //for checking
//   const passwordmatch = await bcrypt.compare(password,passwordHash);
//   console.log(passwordmatch);
// }

// securePassword("Nisha@123");
// **************************************//


app.listen(port, () => {
  console.log(`connection at port no ${port}`);
});
