import { useState } from 'react'
import './styles/App.css'

const API_URL = 'http://localhost:28469';

function App() {
  const [dataSource, setDataSource] = useState('');
  const [error, setError] = useState(null);
  const [returnData, setReturnData] = useState([]);

  const handleSubmitAnalyze = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('dataSource');
    const file = fileInput.files[0];

    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file); // Assurez-vous que 'image' correspond au nom attendu côté serveur

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          console.log('data: ', data);
          setReturnData(data);
        })
      /*.finally(async () => {
        await fetch(`${API_URL}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data })
        })
          .then(res => res.json())
          .then(data => {
            console.log('data: ', data);
            setReturnData(data);
          })
      })*/
    }
    catch (err) {
      console.log('err: ', err);
      setError(err);
    }
  }

  return (
    <>
      <div>
        <div>
          {error && <div>{error}</div>}
        </div>

        <form onSubmit={handleSubmitAnalyze} encType="multipart/form-data">
          <input type="file" name="name" id='dataSource' value={dataSource} onChange={(e) => setDataSource(e.target.value)} accept='image/png, image/jpeg, image/webp' />
          <button>Analyze</button>
        </form>

        <div>
          {returnData?.length > 0 && returnData.map((data, index) => {
            return (
              <div key={index}>
                <div>{data}</div>
              </div>
            )
          })}
        </div>
      </div >
    </>
  )
}

export default App
