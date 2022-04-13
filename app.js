const express =require("express");
const res = require("express/lib/response");
var bodyParser = require('body-parser');
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose");
const userSchema=require("./user");
require("dotenv").config();
const app=express()
app.use(bodyParser.json());
app.get("/login", (req,res)=>{
    const user={
        nombre:"ri",
        username:"ri",
        pass:1234,
        rol:"admin"
    }
    res.json(user)
});
//version
app.get("/version", (req,res)=>{
    res.json({version:"version 1"})
});
//Registrarse
app.post("/signup", (req,res)=>{    
    const data=req.body
    const user=userSchema(req.body);
    user.save()
    .then((datos)=>{
        jwt.sign({data}, "secretKey",{expiresIn:"12d"},(err, token)=>{
            res.json({
                token,
                datos
            })
        })
        })
    .catch((error)=>res.json({message:error}))
});
//login
app.post("/signin", (req,res)=>{
    const info=req.body
    userSchema
    .findOne({username:info.username})
    .then((data)=>{
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
    .catch((error)=>{
        res.json({message:error})
        console.log(error)
    }) 
});
//realizar acciones
/* app.post("/login", verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log("err2")
            console.log(error)
        } else {
            res.json({
                message:"Post fue correcto",
                authData 
            })
        }
    })
}); */
//obtenerTodos
app.get("/alldata", verifyToken, async (req,res)=>{
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log("err2")
            console.log(error)
        } else {        
            console.log(authData)  
            userSchema            
            .findOne({username:authData.data.username})
            .then((data)=>{                
                if (data.rol==="admin") {
                   console.log("admin")
                    userSchema 
                    .find()
                    .then((datos)=>{
                        res.json({datos})
                    })
                    .catch((error)=>{
                        res.json({message:error})
                    })   
                 } else {
                    console.log("no admin")
                    res.status(403)
                    res.json({message:"no tienes permisos para obtener estos datos"})                    
                }                      
            })
            .catch((error)=>{
                console.log("no user")
                res.status(400)
                res.json({message:error})                
            })                                             
        }
    })
});
//obtenerUnUsuario
app.get("/user/:id", verifyToken, (req,res)=>{
    console.log("llegue")
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log("err2")
            console.log(error)
        } else {
            const {id}=req.params
            userSchema
            .findById(id)
            .then((data)=>{
                res.json({data, authData})
            })
            .catch((error)=>{
                res.json({message:error})
            })            
        }
    })
});
//updateUSerPassword
app.put("/pass/:id", verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log(error)
        } else {
            const {pass}=req.body
            const {id}=req.params
            const {nombre,username,rol}=authData.data
            userSchema
            .updateOne({ _id:id},{nombre,username,pass,rol})
            .then((data)=>{
                res.json({data, authData})
            })
            .catch((error)=>{
                res.json({message:error})
            })          
        }
    })
});
//updateUSerAllData
app.put("/user/:id", verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log(error)
        } else {
            const {nombre, username,pass,rol}=req.body
            const {id}=req.params
            userSchema
            .updateOne({ _id:id},{nombre,username,pass,rol})
            .then((data)=>{
                res.json({data, authData})
            })
            .catch((error)=>{
                res.json({message:error})
            })            
        }
    })
});
//deleteUser
app.delete("/user/:id", verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretKey',(error, authData)=>{
        if (error) {
            res.sendStatus(403);
            console.log(error)
        } else {            
            const {id}=req.params
            userSchema
            .remove({ _id:id})
            .then((data)=>{
                res.json({data, authData})
            })
            .catch((error)=>{
                res.json({message:error})
            })            
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
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("conectado a BD")).catch((error)=>console.log(error))
app.listen(3000, function(){
    console.log("nodejs running on 3000")
})