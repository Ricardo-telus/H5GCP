const sql_client = require('mysql')
const client = sql_client.createConnection({
    database: 'imagenes',
    host: "35.223.76.112",
    port: 3306,
    user: "ricardo",
    password: "ricricric" 
})

const get = ({ table, id, tableid}, res) => {
    const sql = `SELECT * FROM ${table} where ${tableid}='${id}'`
    client.query(sql, (err, r) => {
        if (err){
            return res.json(err).status(500)
        }
       res.json(r)
    })
}
const espe = ({ consul }, res) => {
    const sql = consul
    client.query(sql, (err, r) => {
        if (err){
            return res.json(err).status(500)
        }
       res.json(r)
    })
}
exports.function=(req,res)=>{
const path=req.path;
    switch (path) {
        case '/getData':
            get(req.body, res)
            break;
        case '/getData':
            espe(req.body, res)
            break;
        default:
            res.status(200).json("version 1 y funcionando")
            break;
    }
}

