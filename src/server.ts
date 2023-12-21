import {app} from './index';
import {connection} from './db_connection'



connection();
const port: number = 3000;
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})