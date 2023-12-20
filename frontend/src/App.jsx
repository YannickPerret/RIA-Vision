import { useState } from 'react'
import './styles/App.css'

const API_URL_UPLOAD = 'http://localhost:28469';
const API_URL_ANALYZE = 'http://localhost:28468';

function App() {
  const [dataSource, setDataSource] = useState('');
  const [error, setError] = useState(null);
  const [returnData, setReturnData] = useState([]);
  const [maxLabel, setMaxLabel] = useState(10);
  const [minConfidence, setMinConfidence] = useState(70);

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
      await fetch(`${API_URL_UPLOAD}/upload`, {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          console.log('data: ', data);
          setReturnData(data);
        })
        .finally(async () => {
          formData.append('maxLabel', maxLabel);
          formData.append('minConfidence', minConfidence);

          await fetch(`${API_URL_ANALYZE}/analyze`, {
            method: 'POST',
            body: formData
          })
            .then(res => res.json())
            .then(data => {
              console.log('data: ', data);
              setReturnData(data);
            })
        })
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
          <label htmlFor="dataSource">Data source</label>
          <input type="file" name="name" id='dataSource' value={dataSource} onChange={(e) => setDataSource(e.target.value)} accept='image/png, image/jpeg, image/webp' />
          <label htmlFor="maxLabel">Max label</label>
          <input type="number" name="maxLabel" id="maxLabel" value={maxLabel} onChange={(e) => setMaxLabel(e.target.value)} />
          <label htmlFor="minConfidence">Min confidence</label>
          <input type="number" name="minConfidence" id="minConfidence" value={minConfidence} onChange={(e) => setMinConfidence(e.target.value)} />
          <br />
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
