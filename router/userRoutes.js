const express = require("express");
const session = require("express-session");
const userRout = express.Router();
const userControl = require("../controller/userControl");
const userProduct = require("../controller/userProduct")
const passport = require("passport")
const bcrypt = require("bcrypt")
require('../config/passport');
const USER = require('../model/user');
const { sendOTP } = require("../controller/otpController");
const OTP = require('../model/otp');
const productsCollections = require('../model/product');
const router = require("./adminRoutes");
const userAuth = require('../middleware/userAuth')
const userBlock = require('../middleware/userBlock')
const cartControl = require('../controller/cartControl')
const orderControl = require('../controller/orderControl')
const errorHandler = require('../middleware/errorMiddleware')


// Gust view
userRout.get('/',userAuth.userExist,userControl.gustView);

//error page
userRout.get('/error',(req,res)=>{
    res.render('errorView/404')
})

//gust page to login page
userRout.get('/user/Login-Signup',userAuth.userExist,userControl.getLoginPage)
userRout.post("/user/login",userAuth.userExist,userControl.userLogin);

// login to sign up
userRout.get("/user/Signup",userAuth.userExist,userControl.getSignupPage)
userRout.post("/user/Signup",userControl.usersignup)

//Signup to login
userRout.get("/user/login-page",userAuth.userExist,userControl.getSignupPageToLogin)

//sign up to otp page
userRout.get('/user/otp',userAuth.userExist,userControl.getOtpPage)

userRout.get("/user/otp-sent", userControl.otpSender);
userRout.post("/user/otp", userControl.OtpConfirmation);

//user logged home page
userRout.get("/user/home",userBlock,userControl.getHomePage)

//login to forgot page and forgot password
userRout.get('/user/forgot-pass', userControl.forgot_password_page)
userRout.post('/user/forgot-PassWord', userControl.forgotPass)
//Reset password
userRout.get('/user/conformPass', userControl.get_password_reset)
userRout.post('/user/conformPass', userControl.password_reset)

//Resent otp
userRout.get('/user/resend-otp', userControl.otpSender)


//user logout
userRout.get("/user/logout", userControl.logout)

//product details
userRout.get('/productDetails/:id',userAuth.verifyUser,userProduct.getProducDetails);
//product full details
userRout.get('/allProducts',userAuth.verifyUser,userProduct.getAllProducts)

//User profile side
userRout.get('/user/profile',userAuth.verifyUser,userControl.getUserprofile)

//User addresses
userRout.get('/user/AddressBook',userAuth.verifyUser,userControl.getAddressBook)
userRout.post('/user/addAddress',userAuth.verifyUser,userControl.postAddress)
userRout.post('/user/editUserAddress/:id', userAuth.verifyUser, userControl.postEditAddress);
userRout.get('/deleteAddress/:id',userAuth.verifyUser,userControl.getDeleteAddress)

//user change password
userRout.get('/user/changepass',userAuth.verifyUser,userControl.getChangepass)
userRout.post('/changePasswordData',userAuth.verifyUser,userControl.postChangepass)

//User cart
userRout.post('/addtocart/:productId',userAuth.verifyUser,cartControl.postAddtocart)
userRout.get('/user/cart',userAuth.verifyUser,cartControl.getCartPage)
userRout.post('/updatequantity',userAuth.verifyUser,cartControl.postQuantity)
userRout.post('/romoveProduct',userAuth.verifyUser,cartControl.postRemoveProduct)

//Check ou page
userRout.get('/checkOut',userAuth.verifyUser,orderControl.getOrderpage)
userRout.post('/placeOrder',userAuth.verifyUser,orderControl.postplaceOrder)

//User order details
userRout.get('/user/orderDetails',userAuth.verifyUser,orderControl.getOrderPage)
userRout.get('/orderProductView/:id',userAuth.verifyUser,orderControl.getOrderProductViewPage)
userRout.get('/cancelOrderData/:id',userAuth.verifyUser,orderControl.getCancelOrder)






router.use(errorHandler.errorHandler)


module.exports = userRout