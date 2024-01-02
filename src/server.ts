import {app} from './index';
import {connection} from './db_connection'
import { errorHandler } from './handlers/errormiddlaware';



connection();
app.use(errorHandler);
const port: number = 3000;
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})