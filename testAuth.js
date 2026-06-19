async function test() {
  try {
    console.log('Testing Register...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        email: "test@test.com",
        password: "password123",
        studentId: "12345"
      })
    });
    const regData = await regRes.json();
    console.log('Register Response:', regData);
  } catch (err) {
    console.error('Register Error:', err.message);
  }

  try {
    console.log('\nTesting Login...');
    const logRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "test@test.com",
        password: "password123"
      })
    });
    const logData = await logRes.json();
    console.log('Login Response:', logData);
  } catch (err) {
    console.error('Login Error:', err.message);
  }
}

test();
