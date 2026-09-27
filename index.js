const express=require('express');
const app=express();
const ip=require('ip')
const {hideip}=require("./helpers/hideip");

const redis = require("./helpers/redis");
const MAX_ALLOWED_REQ=5;
const MAX_TIME=30_000;

// const ip_mapping={};

// setInterval(()=>{
//     ip_mapping={};
//     console.log('resetting ip mapping');
// },MAX_TIME);

app.use(async(req,res,next)=>{
    //for whitelisting ip addresses
    //if(my ip){
    // next();}

    const my_ip=hideip(ip.address());

    //increment our ip request
    const request = await redis.incr(my_ip)

    // ip_mapping[my_ip]=ip_mapping[my_ip]+1 ||1;
    if(request === 1) {
        await redis.expire(my_ip, MAX_TIME / 1000);
    }
    // console.log(`received request no ${ip_mapping[my_ip]}from ${my_ip}`);
    if(request > MAX_ALLOWED_REQ){
        console.error('too many requests');
        return res.status(429).send('too many request');
    }

    // if(ip_mapping[my_ip]>MAX_ALLOWED_REQ){
    //     console.error('too many requests');
    //     return res.status(429).send('too many request');
    // }
    next();
});

app.get('/',(req,res)=>{
    console.log("received a request");
    
    res.status(200).send("ok");
});


app.listen(8000,()=>console.log('running on port 8000'))