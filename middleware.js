module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','please login first');
        req.session.returnTo = req.originalUrl; 
        return res.redirect('/login');
    }
    else
    {
    next();
}}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}