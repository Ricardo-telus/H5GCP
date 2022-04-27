const sql_client = require('mysql')
const client = sql_client.createConnection({
    database: 'imagenes',
    host: "35.223.76.112",
    port: 3306,
    user: "ricardo",
    password: "ricricric" 
})

const insert = ({ table, names, values }, res) => {
    const n = names.join(', ')
    const v = values.map(v => `'${v}'`).join(', ')
    const sql = `INSERT INTO ${table} (${n}) VALUES (${v})`
    client.query(sql, values, (err, r) => {
        if (err){
            return res.json(err).status(500)
        }
        res.json(r)
    })
}
const get = ({ table, id, tableid}, res) => {
    const sql = `SELECT * FROM ${table} where ${tableid}=${id}`
    client.query(sql, (err, r) => {
        if (err){
            return res.json(err).status(500)
        }
       res.json(r)
    })
}
const delet = ({ table, id, tableid}, res) => {
    const sql = `DELETE * FROM ${table} where ${tableid}=${id}`
    client.query(sql, (err, r) => {
        if (err){
            return res.json(err).status(500)
        }
       res.json(r)
    })
}
const deletAlbum = ({ id, tableid}, res) => {
    const sql = `DELETE * FROM albumImg where ${tableid}=${id}`
    client.query(sql, (err, r) => {
        if (err){
            return res.json(err).status(500)
        }
        const sql = `DELETE * FROM album where ${tableid}=${id}`
        client.query(sql, (err, r) => {
            if (err){
                return res.json(err).status(500)
            }
           res.json({message:"succes all deleted"})
        })
    })
}
const update = ({ table, id, tableid, data}, res) => {
    const sql = `UPDATE FROM ${table} SET ${data} where ${tableid}=${id}`
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
        case '/newEntry':
            insert(req.body, res)
            break;
        case '/updateData':
            update(req.body, res)
            break;
        case '/getData':
            get(req.body, res)
            break;
        case '/deleteData':
            delet(req.body, res)
            break;
        case '/deleteAlbum':
            deletAlbum(req.body, res)
            break;
        default:
            res.status(200).json("version 1 y funcionando")
            break;
    }
}

