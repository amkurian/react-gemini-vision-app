import { useState } from "react"

const App = () => {
  const [image, setImage] = useState(null)
  const [value, setValue] = useState("")
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")

  const surpriseMeOptions = [
    "What hidden objects can you find in this image?",
    "Guess the dominant color in this picture!",
    "What mood does this image convey?",
  ]

  const surprise = () => {
    const randomValue= surpriseMeOptions[Math.floor(Math.random() * surpriseMeOptions.length)]
    setValue(randomValue)
  }

  const uploadImage = async (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setImage(e.target.files[0])
  
    try{
      const options = {
        method: "POST",
        body: formData
      }

      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json()
      console.log(data)
    } catch(err){
      console.log(err)
      setError('Something went wrong')
    }
  }
  const analyzeMe = async () => {
    if (!image) {
      setError('Error! Image not found');
      return;
    }
  
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      };
  
      const response = await fetch('http://localhost:8000/gemini', options);
  
      // Check if the response status is OK (200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.text();
      console.log(data);
      setResponse(data);
    } catch (err) {
      console.log(err);
      setError('Something went wrong');
    }
  };
  

  const clear = () => {
    setImage(null)
    setValue("")
    setResponse("")
    setError("")
  }


  return (
    <div className="app">
      <section className="search-section">
        <div className="image-container">
        { image && <img className= "image" src={URL.createObjectURL(image)} alt='meh'/> }
        </div>
        <p className="extra-info">
          <span>
            <label htmlFor="files">Upload An Image </label>
            <input onChange={uploadImage} id = "files" type="file" accept="image/*" hidden/>
          </span>
          to ask questions about
        </p>
        <p>What do you wnat to know about this image?
          <button className="surprise" onClick={surprise}>Surprise Me</button>
        </p>
        <div className="input-container">
          <input
            value = {value}
            placeholder="What is in the image..."
            onChange={e => setValue(e.target.value)}
            />
            {(!error) && <button onClick={analyzeMe}>Ask Me</button>}
            {(error) && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        {response && <p>{response}</p>}
      </section>
    </div>
  );
}

export default App;
