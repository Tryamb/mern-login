import { useEffect, useState } from 'react';
import axios from 'axios';

const PrivateScreen = ({ history }) => {
  const [error, setError] = useState('');
  const [privateData, setPrivateData] = useState('');

  const logoutHandler = () => {
    localStorage.removeItem('authToken');
    history.push('/login');
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }
    const fetchPrivateData = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };
      try {
        const { data } = await axios.get(
          'https://mern-login-iota.vercel.app/api/private',
          config
        );
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem('authToken');
        setError('You are not authorized please login');
      }
    };
    fetchPrivateData();
  }, [history]);

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
      <div style={{ background: 'black', color: 'white' }}>{privateData}</div>
      <button onClick={logoutHandler}>Logout</button>
      <iframe src="#" style={{ width: '100%', height: '500px' }}></iframe>
    </>
  );
};

export default PrivateScreen;
