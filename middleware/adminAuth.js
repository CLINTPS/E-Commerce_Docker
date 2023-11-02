const verifyAdmin=(req,res,next)=>{
    if((req.session.adminLogin)){
        next()
    }else{
        res.redirect('/admin'); 
    }
}


const adminExist=(req,res,next)=>{
    if(req.session.adminLogin){
        res.redirect('/adminlogin')
    }else{
     next()
    }
}

module.exports={
    verifyAdmin,
    adminExist
}