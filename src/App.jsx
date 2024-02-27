import { useState, useEffect } from 'react'
import './styles/App.css'
import FileUpload from './components/FileUpload';
import { useLanguage } from './providers/languages';

const API_URL_BUCKET = 'http://localhost:28468';
const API_URL_ANALYZE = 'http://localhost:28469';

export default function App() {
  const [dataSource, setDataSource] = useState('');
  const [error, setError] = useState(null);
  const [returnData, setReturnData] = useState();
  const [maxLabel, setMaxLabel] = useState(10);
  const [minConfidence, setMinConfidence] = useState(70);
  const { language, translations, handleLanguageChange } = useLanguage();

  const handleSubmitAnalyze = async (e) => {
    e.preventDefault();
    const file = dataSource[0];

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
          if (data.status === 500) {
            throw new Error(data.error);
          }
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

  const handleUploadedFiles = (files) => {
    setDataSource(files);
  };

  return (
    <>
      <div>
        <div>
          {error && <div>{error}</div>}
        </div>

        <form>
          <select id="language" value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>

        </form>

        <form onSubmit={handleSubmitAnalyze} encType="multipart/form-data">
          <h1>{translations.title}</h1>
          <p>{translations.description}</p>
          <label htmlFor="dataSource">{translations.dataSource}</label>
          <br />
          <FileUpload handleUploadedFiles={handleUploadedFiles} />
          <label htmlFor="maxLabel">{translations.maxLabel}</label>
          <input type="number" name="maxLabel" id="maxLabel" value={maxLabel} onChange={(e) => setMaxLabel(e.target.value)} min={1} />
          <label htmlFor="minConfidence">{translations.minConfidence}</label>
          <input type="number" name="minConfidence" id="minConfidence" value={minConfidence} onChange={(e) => setMinConfidence(e.target.value)} min={1} />
          <br />
          <button>{translations.analyze}</button>
        </form>

        <div>
          {returnData && (
            <>
              {returnData.numberOfLabel > 0 && <div>{translations.labels}: {returnData.numberOfLabel}</div>}
              {returnData.MinConfidence > 0 && <div>{translations.confidence}: {returnData.MinConfidence.toFixed(2)}%</div>}
              {returnData.averageConfidence > 0 && <div>{translations.averageConfidence}: {returnData.averageConfidence.toFixed(2)}%</div>}
              <br />
              {returnData.Labels?.map((label, index) => (
                <div key={index}>
                  <div>{label.Name} à {label.Confidence.toFixed(2)}%</div>
                </div>
              ))}

              <button onClick={() => handleDownloadSQL()}>{translations.downloadSQL}</button>
            </>
          )}
        </div>
      </div >
    </>
  )
}
