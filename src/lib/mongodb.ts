import mongoose from "mongoose";

if (!cached.promise) {
    const checkURI = process.env.MONGODB_URI;
    if (!checkURI) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }
    cached.promise = mongoose.connect(checkURI).then((mongoose) => mongoose);
}

cached.conn = await cached.promise;
return cached.conn;
}
