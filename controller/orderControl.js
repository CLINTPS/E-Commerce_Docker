
const orderCollection = require('../model/order')
const userCollection = require('../model/user')
const cartCollection=require('../model/cart')
const productsCollections = require ('../model/product')
const moment = require("moment")
const mongoose = require('mongoose')

//Get check out page
async function getOrderpage(req,res){
    try{
        let user=req.session.user
        // req.session.totalPrice=total
        const userAddressData = await userCollection.findOne({ userName: user })
        res.render('userView/userCheckout',{title:"Checkout page",user,userAddressData})
    }catch (error) {
        console.error("An error occurred:", error);
        console.log("cart data note available");
        res.render("errorView/404");
    }
}

//post ckeck out page
async function postplaceOrder(req, res) {
    const email = req.session.email;
    console.log("cart 1=" + email);
    let datas = req.body;
    console.log(datas);
    const Address = req.body.selectedAddress;
    const paymentMethod = req.body.selectedPayment;
    const amount = req.session.totalPrice;
    console.log(amount);
    
    try {
        const userData = await userCollection.findOne({ email: email });
        console.log(userData);
        
        if (!userData) {
            console.log("cart data note available");
            res.render("errorView/404admin");
            return;
        }

        const userID = userData._id;
        // console.log("order time user id ",userID);

        const cartData = await cartCollection.findOne({ userId: userID }).populate("products.productId");
        // console.log("cartData",cartData);

        if (!cartData) {
            console.log("Cart data not available");
            res.render("errorView/404admin");
            return;
        }

        const addressNew = await userCollection.findOne({
            _id:userID,
            address:{$elemMatch:{_id: new mongoose.Types.ObjectId(Address)}}
        })
        console.log("address 0001:",addressNew); 

        const add = {
            Name: addressNew.address[0].nameuser,
            Address:  addressNew.address[0].addressLine,
            Pincode: addressNew.address[0].pincode,
            City: addressNew.address[0].city,
            State: addressNew.address[0].state,
            Mobile:  addressNew.address[0].mobile,
        }

        const newOrder = new orderCollection({
            UserId: userID,
            Items: cartData.products,
            PaymentMethod: paymentMethod,
            OrderDate: moment(new Date()).format("llll"),
            ExpectedDeliveryDate: moment().add(4, "days").format("llll"),
            TotalPrice: amount,
            Address: add,
        });

        const order = await newOrder.save();
        req.session.orderID = order._id;
        // console.log("Order detail", order);
        await cartCollection.findByIdAndDelete(cartData._id);

        for (const item of order.Items) {
            const productId = item.productId;
            const quantity = item.quantity;
            const product = await productsCollections.findById(productId);

            if (product) {
                const updateQuantity = product.AvailableQuantity - quantity;
                if (updateQuantity < 0) {
                    product.AvailableQuantity = 0;
                    product.Status = "Out of stock";
                } else {
                    product.AvailableQuantity = updateQuantity;
                    await product.save();
                }
            }
        }

        if (paymentMethod === "cod") {
            res.render('userView/placeOrder');
        }
    } catch (error) {
        console.error("An error occurred:", error);
        console.log("cart data note available 01--");
        res.render("errorView/404");
    }
}

//User order details page

async function getOrderPage(req,res){
    try{        
        let user=req.session.user
        let email=req.session.email
        // console.log("orderss",email);
        const userData= await userCollection.findOne({ email:email})
        const userId = userData._id
        // .sort({OrderDate:-1})
        const orders = await orderCollection.find({UserId:userId}).populate('Items.productId')
        // console.log("gyugffg",orders);
        res.render('userView/userOrder',{title:"Order details",user,orders})
    }catch (error) {
        console.error("An error occurred:", error);
        console.log("cart data note available 01--");
        res.render("errorView/404");
    }
}

//User order product view details
async function getOrderProductViewPage(req,res){
    try{
        let orderID=req.params.id
        if (!mongoose.Types.ObjectId.isValid(orderID)) {
            // Handle invalid order ID here, e.g., render an error page
            console.error("Invalid order ID");
            res.render("errorView/404");
            return;
        }
        console.log(orderID);
        let user=req.session.user
        const orders = await orderCollection.findOne({_id:orderID}).populate('Items.productId')
        // console.log("222222",orders);
        const TotalPrice = orders.TotalPrice
        if(!orders){
            console.log("DATA NOT");
            res.render("errorView/404");
        }
        // const productId = orderData.Items[0].productId;
        // const productData = await productsCollections.findOne({_id:productId})
        // console.log("33333333",productData);
        res.render('userView/userOrderProductView',{title:"Order product view",user,TotalPrice,orderData:orders.Items})
    }catch (error) {
        console.error("An error occurred:", error);
        console.log("cart data note available 02--");
        res.render("errorView/404");
    }
}

//Cancel order 
async function getCancelOrder(req,res){
    try{
        let id=req.params.id
        console.log("111",id);
        const orderData = await orderCollection.findById(id)
        console.log("222",orderData);
        if(!orderData){
            console.log("Order datas no fount");
            res.render("errorView/404");
        }

        if(orderData.Status === "Order Placed" || orderData.Status === "Shipped" || orderData.Status === "Pending"){
            const updateProducts = orderData.Items
            console.log("333",updateProducts);
            for(const product of updateProducts){
                const cancelProduct = await productsCollections.findById(product.productId)
                console.log("444",cancelProduct);
                if(cancelProduct){
                    cancelProduct.AvailableQuantity += product.quantity;
                    await cancelProduct.save();
                }
            }
            orderData.Status = "Cancelled";
            await orderData.save();
            res.redirect('/user/orderDetails')
        }else{
            console.log("Order canot be cancelled");
        }

    }catch (error) {
        console.error("An error occurred:", error);
        console.log("cart data note available 03--");
        res.render("errorView/404");
    }
}

module.exports={
    getOrderpage,
    postplaceOrder,
    getOrderPage,
    getOrderProductViewPage,
    getCancelOrder
}