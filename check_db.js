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

    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const Contact = require(path.join(__dirname, '..', 'models', 'contact'));
    const Payment = require(path.join(__dirname, '..', 'models', 'payment'));
    const Order = require(path.join(__dirname, '..', 'models', 'Order'));

    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(5).lean();
    const payments = await Payment.find().sort({ createdAt: -1 }).limit(5).lean();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();

    console.log('\n=== Contacts (latest) ===');
    console.log(JSON.stringify(contacts, null, 2));

    console.log('\n=== Payments (latest) ===');
    console.log(JSON.stringify(payments, null, 2));

    console.log('\n=== Orders (latest) ===');
    console.log(JSON.stringify(orders, null, 2));

    await mongoose.disconnect();
    process.exit(0);
  }catch(err){
    console.error('Error checking DB:', err);
    process.exit(2);
  }
}

main();
