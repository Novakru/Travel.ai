import { useState } from 'react';

const Chatbot: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [travelPlan, setTravelPlan] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTravelPlan(''); // Clear previous travel plan
    setError(''); // Clear previous errors

    const data = { location };
    fetch('http://127.0.0.1:8000/recommend-travel-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then(response => {
      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        function read() {
          reader.read().then(({ done, value }) => {
            if (done) {
              console.log('Stream closed');
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            chunk.split('\n').forEach(eventString => {
              if (eventString.startsWith('data: ')) {
                const str = eventString.substring('data: '.length);
                setTravelPlan(prev => prev + str.replace('\\n', '\n'));
              }
            });

            read();
          }).catch(error => {
            console.error('Stream error', error);
            setError('Sorry, there was an error fetching the travel plan.');
          });
        }

        read();
      } else {
        console.error('Network response was not ok.');
        setError('Sorry, there was an error fetching the travel plan.');
      }
    }).catch(error => {
      console.error('Fetch error:', error);
      setError('Sorry, there was an error fetching the travel plan.');
    });
  };

  return (
    <div>
      <h1>Travel Plan Recommender</h1>
      <form id="travelPlanForm" onSubmit={handleSubmit}>
        <label htmlFor="location">Enter your desired location:</label>
        <input
          type="text"
          id="location"
          name="location"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Get Travel Plan</button>
      </form>
      <div id="travelPlanResult">
        <pre style={{ whiteSpace: 'pre-wrap' }}>{travelPlan}</pre>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Chatbot;
