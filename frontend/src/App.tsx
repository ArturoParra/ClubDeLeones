import { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api')
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}

export default App;

