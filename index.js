const express=require('express');
const app=express();
const ip=require('ip')
const {hideip}=require("./helpers/hideip");
const MAX_ALLOWED_REQ=5;
const MAX_TIME=30_000;

// const ip_mapping={};

// setInterval(()=>{
//     ip_mapping={};
//     console.log('resetting ip mapping');
// },MAX_TIME);

app.use((req,res,next)=>{
    const my_ip=hideip(ip.address());

    // ip_mapping[my_ip]=ip_mapping[my_ip]+1 ||1;
    // console.log(`received request no ${ip_mapping[my_ip]}from ${my_ip}`);
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