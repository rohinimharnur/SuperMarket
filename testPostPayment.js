require('dotenv').config();
const fetch = global.fetch || require('node-fetch');

async function run(){
  const url = 'http://localhost:' + (process.env.PORT || 3001) + '/api/payment';
  const payload = {
    customerName: 'Rahul Patil',
    customerEmail: 'rahul.patil@gmail.com',
    customerPhone: '9876543210',
    address: '123, MG Road, Pune, Maharashtra',
    products: [
      { productName: 'A', quantity: 1, price: 50 },
      { productName: 'B', quantity: 2, price: 95 }
    ],
    totalAmount: 240,
    payment: 'card',
    cardName: 'Rahul Patil',
    cardNumber: '4111111111111111'
  };

  try{
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    console.log('Status', res.status);
    console.log(data);
  }catch(e){
    console.error('Request failed', e.message);
  }
}

run();
