import logo from './logo.svg';
import './App.css';
import React from "react";
import Title from "./components/Title"

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};



console.log("야옹");

//







const Search_Box = ({updateMainCat}) => {


  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  const [value, setValue] = React.useState('');

  const [errorMessage,setErrorMessage] = React.useState('')

  function handleInputChange(e) {

    const userValue = e.target.value;
    console.log(includesHangul(userValue));
    if(includesHangul(userValue)){

      setErrorMessage("한글 안됨");

    }else{

      setErrorMessage("");

    }

    setValue(userValue.toUpperCase());
  }



  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (value === "") {

      setErrorMessage("빈값 안됨");
      return;
    }

    updateMainCat(value);

  }


  return (
      <form onSubmit={handleFormSubmit}>
        <input
            type="text"
            name="name"
            placeholder="영어 대사를 입력해주세요"
            onChange={handleInputChange}
            value ={value}
        />
        <button type="submit">생성1</button>
        <p style={{color: 'red'}}>{errorMessage}</p>
      </form>
  );

};




const MainCard = ({img,onHeartClick,alreadyFavorite}) => {
  const heartIcon = alreadyFavorite ? "💖" :  "🤍"

  return   (
      <div className="main-card">
        <img src={img} alt="고양이" width="400"/>
        <button onClick={onHeartClick}>{heartIcon}</button>
      </div>

  );

}


function CatItem(props) {

  return   (
      <li>
        <img src={props.img}/>
      </li>

  );

}

function  Favorites({favorites}) {

  if (favorites.length === 0) {

    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;

  }



  return (

      <ul className="favorites">
        {favorites.map(cat =>(
            <CatItem img= {cat} key={cat}/>
        ))}

      </ul>

  )

}



const App = () => {

  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";



  const [counter, setCounter] = React.useState(() => {

    return jsonLocalStorage.getItem("counter")

  })


  const [mainCat, setmainCat] = React.useState(CAT1);


  const [favorites, setFavorites] = React.useState(() => {

    return jsonLocalStorage.getItem("favorites") || []

  })




  const alreadyFavorite = favorites.includes(mainCat)


  async function setInitialCat() {

    const newCat = await fetchCat('First cat');
    console.log(newCat);
    setmainCat(newCat);

  }

  React.useEffect(() => {

    setInitialCat();

  },[])

  React.useEffect(() => {

    console.log("헬로");
    ;
  }, [counter])






  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setmainCat(newCat);


    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter",nextCounter);
      return nextCounter;

    })


  }

  function handleHeartClick() {
    const nextFavorites = [...favorites,mainCat]
    setFavorites(nextFavorites);

    jsonLocalStorage.setItem("favorites",nextFavorites)

  }

  const counterTitel = counter === null ? "" : counter + "번째 ";


  return (
      <div>
        <Title>{counterTitel} 고양이 가라사대</Title>
        <Search_Box updateMainCat={updateMainCat}/>
        <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite}/>
        <Favorites favorites={favorites}/>
      </div>
  )
}


export default App;
