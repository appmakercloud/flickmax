// Test the cart API locally
const testCart = async () => {
  try {
    console.log('Testing cart API...\n');
    
    // Test with a domain
    const response = await fetch('http://localhost:3000/api/cart/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [
          {
            id: 'domain',
            domain: 'flickmax.app'
          }
        ],
        skipCrossSell: true
      })
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.nextStepUrl) {
      console.log('\nCheckout URL:', result.nextStepUrl);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testCart();