const express =require("express");
const axios = require('axios')
var bodyParser = require('body-parser');
const jwt=require("jsonwebtoken")
require("dotenv").config();
const app=express()
app.use(bodyParser.json());
//version
app.get("/version", (req,res)=>{
    res.json({version:"version 1"})
});
//insert data
app.post("/insertData", (req,res)=>{ 
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log(error)
        } else {
            try {
                axios
                .post('https://us-central1-final-348322.cloudfunctions.net/finalproject/newEntry', req.body)
                .then(data => {
                    res.json(data)
                })
                .catch((error)=>res.json({message:error}))   
            } catch (error) {
                res.json({message:error})
            }           
        }
    })
});
//Registrarse
app.post("/signup", (req,res)=>{    
    try {
        axios
        .post('https://us-central1-final-348322.cloudfunctions.net/finalproject/newEntry', req.body)
        .then(datos => {
            jwt.sign({data}, "secretKey",{expiresIn:"12d"},(err, token)=>{
                res.json({
                    token,
                    datos
                })
            })
        })
        .catch((error)=>res.json({message:error}))   
    } catch (error) {
        res.json({message:error})
    }    
});
//login
app.post("/signin", (req,res)=>{
    try {
        axios
        .post('https://us-central1-final-348322.cloudfunctions.net/finalproject/getData', req.body)
        .then(data => {
            if (String(data.pass)===String(info.pass)) {
                jwt.sign({data}, "secretKey",{expiresIn:"12d"},(err, token)=>{
                    res.json({
                        token,
                        data
                    })
                })
                console.log(data.pass)   
            } else {
                res.status(400)
                res.json({message:"don't match info"})    
            } 
        })
        .catch((error)=>res.json({message:error}))   
    } catch (error) {
        res.json({message:error})
    }    
});
//obtenerTodos ya sea img o album, user
app.get("/allData", verifyToken, async (req,res)=>{
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log(error)
        } else {   
            try {
                axios
                .post('https://us-central1-final-348322.cloudfunctions.net/finalproject/getData', req.body)
                .then(data => {
                    res.json(data)
                })
                .catch((error)=>res.json({message:error}))   
            } catch (error) {
                res.json({message:error})
            }                                            
        }
    })
});
//updateData
app.put("/update", verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log(error)
        } else {
            try {
                axios
                .post('https://us-central1-final-348322.cloudfunctions.net/finalproject/updateData', req.body)
                .then(data => {
                    res.json(data)
                })
                .catch((error)=>res.json({message:error}))   
            } catch (error) {
                res.json({message:error})
            }           
        }
    })
});
//deleteUserImg
app.delete("/dataDelete", verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log(error)
        } else {            
            try {
                axios
                .post('https://us-central1-final-348322.cloudfunctions.net/finalproject/deleteData', req.body)
                .then(data => {
                    res.json(data)
                })
                .catch((error)=>res.json({message:error}))   
            } catch (error) {
                res.json({message:error})
            }            
        }
    })
});
//deleteAlbum
app.delete("/dataAlbum", verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log(error)
        } else {            
            try {
                axios
                .post('https://us-central1-final-348322.cloudfunctions.net/finalproject/deleteAlbum', req.body)
                .then(data => {
                    res.json(data)
                })
                .catch((error)=>res.json({message:error}))   
            } catch (error) {
                res.json({message:error})
            }            
        }
    })
});
function verifyToken(req, res, next){
const bearerHeader=req.headers['authorization'];
    if (typeof bearerHeader!=='undefined') {
        const bearerToken=bearerHeader.split(" ")[1];
        req.token=bearerToken;
        next();
    } else {
        console.log("err1")
        res.sendStatus(403);
    }
}
app.listen(3000, function(){
    console.log("nodejs running on 3000")
})