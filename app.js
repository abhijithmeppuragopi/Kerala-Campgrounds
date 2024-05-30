if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const express=require('express');
const ejs=require('ejs');
const ejsMate=require('ejs-mate');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const session =require('express-session');
const flash = require('connect-flash');
const methodOverride= require('method-override');
const passport= require('passport');
const Localstrategy=require('passport-local');
const ExpressError= require('./utils/ExpressError.js');
const campgroundRouter=require('./router/campgroundRouter');
const reviewRouter=require('./router/reviewRouter');
const registerRouter=require('./router/registerRouter');
const User=require('./models/Usermodel');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');


const isLoggedIn=require('./middleware.js');
const path= require('path');
const { config } = require('dotenv');
const app=express();
// const dbUrl='mongodb+srv://itsmeabhijith:Bca140021044451@cluster0.8bbgsdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// const dbUrl='mongodb://127.0.0.1:27017/keralacampground';
const dbUrl=process.env.dbUrl || 'mongodb://127.0.0.1:27017/keralacampground';

     mongoose.connect(dbUrl) 
  const db=mongoose.connection;
  db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

// mongoose.connect('mongodb://127.0.0.1:27017/keralacampground');

// conn.on('connected', () => console.log('connected'));
// conn.on('open', () => console.log('open'));
// conn.on('disconnected', () => console.log('disconnected'));
// conn.on('reconnected', () => console.log('reconnected'));
// conn.on('disconnecting', () => console.log('disconnecting'));
// conn.on('close', () => console.log('close'));


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(mongoSanitize());

app.engine('ejs',ejsMate);

const secret=process.env.secret || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret 
    }
});
store.on('error',function(e){
    console.log('something went wrong',e);
})

const sessionConfig= {
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
        // secure:true
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
  const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://getbootstrap.com/",
    
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://getbootstrap.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",

];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dcbgiomwt/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://plus.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);





app.use(passport.initialize());
app.use(passport.session());

passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.localuser=req.user;
    next();
})

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/review', reviewRouter);
app.use('/', registerRouter);


app.get('/',(req,res)=>{
    res.render('index');
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, ()=>{
    console.log('im working')
});
