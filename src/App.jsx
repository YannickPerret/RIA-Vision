// ajouter dans le wiki j'ai utilisé le finally pour faire le deuxième fetch de suite


import { useState } from 'react'
import './styles/App.css'

const API_URL_BUCKET = 'http://localhost:28468';
const API_URL_ANALYZE = 'http://localhost:28469';

function App() {
  const [dataSource, setDataSource] = useState('');
  const [error, setError] = useState(null);
  const [returnData, setReturnData] = useState();
  const [maxLabel, setMaxLabel] = useState(10);
  const [minConfidence, setMinConfidence] = useState(70);

  const handleSubmitAnalyze = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('dataSource');
    const file = fileInput.files[0];
    let returnUrl = '';

    if (!file) {
      setError('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);

    try {
      await fetch(`${API_URL_BUCKET}/upload`, {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          console.log('data: ', data);
          returnUrl = data.url;
        })
        .catch(err => {
          throw err;
        })
        .finally(async () => {
          await fetch(`${API_URL_ANALYZE}/analyze`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              url: returnUrl,
              maxLabel: Number(maxLabel),
              minConfidence: Number(minConfidence)
            })
          })
            .then(res => res.json())
            .then(data => {
              setReturnData({ ...data.data, url: returnUrl });

              setMaxLabel(10);
              setMinConfidence(70);
              setDataSource('');
            })
            .catch(err => {
              throw err;
            })
        })
    }
    catch (err) {
      console.log('err: ', err);
      setError(err);
    }

  }

  const handleDownloadSQL = async () => {
    try {
      console.log('returnData.url: ', returnData)
      const response = await fetch(`${API_URL_ANALYZE}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: returnData.url })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'insert.sql');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

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
          <input type="number" name="maxLabel" id="maxLabel" value={maxLabel} onChange={(e) => setMaxLabel(e.target.value)} min={1} />
          <label htmlFor="minConfidence">Min confidence</label>
          <input type="number" name="minConfidence" id="minConfidence" value={minConfidence} onChange={(e) => setMinConfidence(e.target.value)} min={1} />
          <br />
          <button>Analyze</button>
        </form>

        <div>
          {returnData && (
            <>
              {returnData.numberOfLabel > 0 && <div>Labels: {returnData.numberOfLabel}</div>}
              {returnData.MinConfidence > 0 && <div>Confidence: {returnData.MinConfidence.toFixed(2)}%</div>}
              {returnData.averageConfidence > 0 && <div>Average confidence: {returnData.averageConfidence.toFixed(2)}%</div>}
              <br />
              {returnData.Labels?.map((label, index) => (
                <div key={index}>
                  <div>{label.Name} à {label.Confidence.toFixed(2)}%</div>
                </div>
              ))}

              <button onClick={() => handleDownloadSQL()}>Download SQL</button>
            </>
          )}
        </div>
      </div >
    </>
  )
}

export default App
