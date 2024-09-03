import dotenv from 'dotenv'
import { app } from './app.js'
import { database } from './utiles/databaseConnection.js'
dotenv.config({
    path: './.env'
})

database()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("Server connection failed !!! ", error);
    })
