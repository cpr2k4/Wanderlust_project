function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}

module.exports = wrapAsync;

// Here:
// catch((err)=>next(err)) directly written in this format:- 
// catch(next)

//we use wrapAsync to avoid using try and catch for every async function
