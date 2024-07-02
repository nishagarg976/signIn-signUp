const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/youtubeRegistration")
.then(()=>{
  console.log(`Connection sussessful`);
}).catch((err)=>{
  console.log(err);
})



//another way
// const URI = "mongodb://127.0.0.1:27017/youtubeRegistration";

// const connectDb = async()=>{
//   try{
//     await mongoose.connect(URI);
      // console.log(`Connection sussessful`);
//   }catch(error){
//     console.error("database conn failed")
//     process.exit(0);
//   }
// }


