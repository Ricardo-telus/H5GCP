const express =require("express");
const sql_client = require('mysql')
require("dotenv").config();
const axios = require('axios')
var bodyParser = require('body-parser');
const jwt=require("jsonwebtoken")
const app=express()
//const actions=require('./controllers/userController')

app.use(bodyParser.json());
const client = sql_client.createConnection({
    database: 'imagenes',
    host: "35.223.76.112",
    port: 3306,
    user: "ricardo",
    password: "ricricric" //abcd1234
})
client.connect(err => console.log(err || `> Connection stablished`))
const api=process.env.CLOUD_FUNCTION
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
                .post(api+'/newEntry', req.body)
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
app.post("/signup", (req, res) => {
    try {
        const n = req.body.names.join(', ')
        const v = req.body.values.map(v => `'${v}'`).join(', ')
        const sql = `INSERT INTO ${req.body.table} (${n}) VALUES (${v})`
        console.log(`> Executing ${sql}`)
        client.query(sql, req.body.values, (err, r) => {
            if (err){
                console.log(`! Error inserting to table ${req.body.table}`)
                console.log(err)
                return {status:false}
            }
           jwt.sign({id:r.insertId}, "secretKey",{expiresIn:"12d"}, (err, token)=>{
                res.json({
                    token:  token,
                    id:r.insertId,
                    status:1
                })
                console.log(token,r.insertId)
            })
        })
    } catch (error) {
        console.log(error)
        res.json({status:3})
    }  
});
//login
app.post("/signin", (req,res)=>{
    try {
        axios
        .post(api+'/getData', {
            table:"user",
            id:req.body.username,
            tableid:"username"
            })
        .then(result => {
            console.log(result.data)
            if (String(result.data[0].password)===String(req.body.pass)) {
                jwt.sign({result:result.data}, "secretKey",{expiresIn:"12d"},(err, token)=>{
                    res.json({
                        token,
                        info:result.data,
                        status:1
                    })
                })
            } else {
                res.status(400).json({message:"don't match info", status:2})    
            } 
        })
        .catch((error)=>{res.status(400).json({message:error}); console.log(error)})   
    } catch (error) {
        res.status(400).json({Error:error, status:3})
        console.log(error)
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
                .post(api+'/getData', req.body)
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
                .post(api+'/updateData', req.body)
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
                .post(api+'/deleteData', req.body)
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
                .post(api+'/deleteAlbum', req.body)
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
//especial
app.post("/especial", verifyToken, (req,res)=>{
    try {
        console.log(req.body)
        axios
        .post(api+'/especial', {
            consul:req.body.consulta
            })
        .then(result => {
            res.json({result})
        })
        .catch((error)=>{res.status(400).json({message:error}); console.log(error)})   
    } catch (error) {
        res.status(400).json({message:error})
        console.log(error)
    }   
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
