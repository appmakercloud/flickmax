// Test direct GoDaddy API call
const testDirectAPI = async () => {
  try {
    console.log('Testing direct GoDaddy API...\n');
    
    const url = 'https://www.secureserver.net/api/v1/cart/590175?redirect=false';
    const body = {
      items: [
        {
          id: 'domain',
          domain: 'flickmax.app'
        }
      ],
      skipCrossSell: true
    };
    
    console.log('URL:', url);
    console.log('Body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const responseText = await response.text();
    console.log('\nResponse status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response body:', responseText);
    
    try {
      const result = JSON.parse(responseText);
      console.log('\nParsed response:', JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('\nResponse is not JSON');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testDirectAPI();