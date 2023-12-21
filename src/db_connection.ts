import mongoose from 'mongoose';

export function connection() {
    mongoose.connect('mongodb+srv://rifshmuhammed:1cijhAanIjgYUcvL@cluster0.9ik2otk.mongodb.net/users?retryWrites=true&w=majority', {
        // dbName:'usermodels'
    })
        .then((conn) => {
            console.log('connected successfully');
        }).catch((err) => {
            console.log(err.message);

        })
}

