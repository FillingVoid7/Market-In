import client from "@lib/db";

const connectDb = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

export default connectDb;
