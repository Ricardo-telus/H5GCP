#comandos para crear la instancia sql 
gcloud sql instances create sqlproject \
--database-version=MYSQL_8_0_28
#listar las instancias sql
gcloud sql instances describe sqlproject
#comando para agregar contrasena al usuario root
gcloud sql users set-password root \
--host=% \
--instance=INSTANCE_NAME \
--prompt-for-password

#base de datos consultas de tablas
#------------usuarios data
{
    "table":"user",
    "schema": [
        {
           "name": "idUser",
           "type": "INT(10) AUTO_INCREMENT"
        },
        {
           "name": "name",
           "type": "VARCHAR(30)"
        },
        {
           "name": "username",
           "type": "VARCHAR(30)"
        },
        {
           "name": "password",
           "type": "VARCHAR(30)"
        },
        {
           "name": "biografia",
           "type": "VARCHAR(30)"
        },
        {
           "name": "gravatar",
           "type": "VARCHAR(100)"
        }
        ,
        {
           "name": "PRIMARY KEY",
           "type": "(idUser)"
        }
    ]
}
# CREATE TABLE user (idUser INT(10) AUTO_INCREMENT,name VARCHAR(30),username VARCHAR(30),password VARCHAR(30),biografia VARCHAR(30),gravatar VARCHAR(100),PRIMARY KEY (idUser))

#------------album data
{
    "table":"album",
    "schema": [
        {
           "name": "idAlbum",
           "type": "INT(10) AUTO_INCREMENT"
        },
        {
           "name": "name",
           "type": "VARCHAR(30)"
        },
        {
           "name": "idUserA",
           "type": "INT(10) NOT NULL"
        },
        {
           "name": "PRIMARY KEY",
           "type": "(idAlbum)"
        },
        {
           "name": "CONSTRAINT fk_album_user",
           "type": "FOREIGN KEY(idUserA) REFERENCES user(idUser) ON DELETE CASCADE ON UPDATE CASCADE"
        }
    ]
}
# CREATE TABLE album (idAlbum INT(10) AUTO_INCREMENT,name VARCHAR(30),idUserA INT(10) NOT NULL,PRIMARY KEY (idAlbum),CONSTRAINT fk_album_user FOREIGN KEY(idUserA) REFERENCES user(idUser) ON DELETE CASCADE ON UPDATE CASCADE)

#------------Fotos
{
    "table":"imagenes",
    "schema": [
        {
           "name": "idImg",
           "type": "INT(10) AUTO_INCREMENT"
        },
        {
           "name": "descripcion",
           "type": "VARCHAR(50)"
        },
        {
           "name": "favorito",
           "type": "tinyint(1) DEFAULT 0"
        },
        {
           "name": "URL",
           "type": "VARCHAR(250)"
        },
        {
           "name": "idUserI",
           "type": "INT(10)"
        },
        {
           "name": "PRIMARY KEY",
           "type": "(idImg)"
        },
        {
           "name": "CONSTRAINT fk_img_user ",
           "type": "FOREIGN KEY(idUserI) REFERENCES user(idUser) ON DELETE CASCADE ON UPDATE CASCADE"
        }
    ]
}
# CREATE TABLE imagenes (idImg INT(10) AUTO_INCREMENT,descripcion VARCHAR(50),favorito tinyint(1) DEFAULT 0,URL VARCHAR(250),idUserI INT(10),PRIMARY KEY (idImg),CONSTRAINT fk_img_user  FOREIGN KEY(idUserI) REFERENCES user(idUser) ON DELETE CASCADE ON UPDATE CASCADE)

#------------union albumes y fotos
{
    "table":"albumImg",
    "schema": [
        {
           "name": "idUn",
           "type": "INT(10) AUTO_INCREMENT"
        },
        {
           "name": "idAlbumU",
           "type": "INT(10) NOT NULL"
        },
        {
           "name": "idImgU",
           "type": "INT(10) NOT NULL"
        },
        {
           "name": "PRIMARY KEY",
           "type": "(idUn)"
        },
        {
           "name": "CONSTRAINT fk_album ",
           "type": "FOREIGN KEY(idAlbumU) REFERENCES album(idAlbum) ON DELETE CASCADE ON UPDATE CASCADE"
        },
        {
           "name": "CONSTRAINT fk_img ",
           "type": "FOREIGN KEY(idImgU) REFERENCES imagenes(idImg) ON DELETE CASCADE ON UPDATE CASCADE"
        }
    ]
}
#REATE TABLE albumImg (idUn INT(10) AUTO_INCREMENT,idAlbumU INT(10) NOT NULL,idImgU INT(10) NOT NULL,PRIMARY KEY (idUn),CONSTRAINT fk_album  FOREIGN KEY(idAlbumU) REFERENCES album(idAlbum) ON DELETE CASCADE ON UPDATE CASCADE,CONSTRAINT fk_img  FOREIGN KEY(idImgU) REFERENCES imagenes(idImg) ON DELETE CASCADE ON UPDATE CASCADE)

#comandos para la cloud functions
gcloud functions deploy 'finalproject' --runtime nodejs16 --trigger-http --entry-point=function



