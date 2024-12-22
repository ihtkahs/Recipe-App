import logo from './logo.svg';
import './App.css';
import React from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function App() {
  React.useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'test'));
      querySnapshot.forEach(doc => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      });
    };

    fetchData();
  }, []);

  return <div>Firebase Integration Test</div>;
}

export default App;
