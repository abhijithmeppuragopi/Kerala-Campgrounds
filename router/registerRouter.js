const express=require('express')
const router= express.Router();
const passport=require('passport');
const catchAsync=require('../utils/catchAsync');
const { storeReturnTo }=require('../middleware.js');
const User= require('../models/Usermodel');


router.get('/register',(req,res)=>{
    res.render('user/register')
})
router.post('/register',catchAsync(async (req,res,next)=>{
    try{
    const {username,email,password}=req.body;
    const user= await new User({email, username});
    const newUser=await User.register(user,password);
    req.login(newUser,function(err){
        if(err){
            next(err);
    }
    else{
        req.flash('success','Succesfully registered');
        return res.redirect('/campgrounds');
    }})
    
}catch(e){
    req.flash('error',e.message);
    res.redirect('/register');
}
}))

router.get('/login',(req,res)=>{
res.render('user/login')
})
router.post('/login' ,storeReturnTo,passport.authenticate('local', {failureFlash:true, failureRedirect: '/login' }),(req,res)=>{
    req.flash('success','welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    })

router.get('/logout', (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('/');
        });
    }); 


module.exports= router;
