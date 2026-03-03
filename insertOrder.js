require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

async function main(){
  try{
    const url = process.env.MONGO_URL;
    if(!url){
      console.error('MONGO_URL not set in .env');
      process.exit(1);
    }

    await mongoose.connect(url);
    console.log('Connected to MongoDB');

    const Order = require(path.join(__dirname, '..', 'models', 'Order'));

    const order = new Order({
      userId: new mongoose.Types.ObjectId(),
      products: [ { name: 'Sample Product', price: 199, quantity: 1 } ],
      totalAmount: 199,
      paymentStatus: 'PAID'
    });

    const saved = await order.save();
    console.log('Inserted order id:', saved._id);

    await mongoose.disconnect();
    process.exit(0);
  }catch(err){
    console.error('Error inserting order:', err);
    process.exit(1);
  }
}

main();
