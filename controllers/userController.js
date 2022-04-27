const sql_client = require('mysql')
const client = sql_client.createConnection({
    database: 'imagenes',
    host: "35.223.76.112",
    port: 3306,
    user: "ricardo",
    password: "ricricric" //abcd1234
})
client.connect(err => console.log(err || `> Connection stablished`))

//Crear un usuario nuevo
exports.createUser = ({ table, names, values }) => {
    try {
        const n = names.join(', ')
        const v = values.map(v => `'${v}'`).join(', ')
        const sql = `INSERT INTO ${table} (${n}) VALUES (${v})`
        console.log(`> Executing ${sql}`)
        client.query(sql, values,async (err, r) => {
            if (err){
                console.log(`! Error inserting to table ${table}`)
                console.log(err)
                return {status:false}
            }
            console.log('usuario registrado'+r.insertId)
            return {status:true, id: await r.insertId}
        })
    } catch (error) {
        console.log(error)
        return {status:false}        
    }
}