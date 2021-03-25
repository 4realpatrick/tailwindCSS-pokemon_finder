import { FC, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { IPokemonListLocal, IPokemonLocal, IPokemon } from "../interface";

const initialPokemon = {
  count: 0,
  next: "",
  previcous: "",
  results: [],
};


// 宝可梦列表
const Home: FC = () => {
  // fetch的宝可梦数据,后端结构
  const [pokemon, setPokemon] = useState<IPokemonListLocal>(initialPokemon);
  // input数据
  const [pokemonInput, setPokemonInput] = useState<string>("");
  // 筛选后的宝可梦数据,在前端
  const [filteredPokemon, setFilteredPokemon] = useState<IPokemonLocal[]>([]);
  // 默认加载100条
  const [limit,setLimit] = useState<number>(100);
  // 是否显示加载中状态
  const [showLoading,setShowLoading] = useState<boolean>(true)
  // 加载所有数据后,会隐藏加载更多按钮
  const [hideLoadingButton,setHideLoadingButton] = useState<boolean>(false)

  useEffect(() => {
    setShowLoading(true)
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        if(!data.next){
          setHideLoadingButton(true)
        }
        const results = data.results.map((pokemon: IPokemon, index: number) => {
          return { ...pokemon, index: index + 1 };
        });
        setPokemon({ ...data, results });
        setShowLoading(false)
      });
  }, [limit]);

  useMemo(() => {
    if (pokemonInput.length === 0) {
      setFilteredPokemon(pokemon.results);
      return;
    }
    if (pokemon) {
      setFilteredPokemon(() =>
        pokemon.results.filter(pokemon => pokemon.name.includes(pokemonInput!))
      );
    }
  }, [pokemonInput, pokemon]);

  // 输入框筛选条件改变
  const pokemonFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void = event => {
    setPokemonInput(event.target.value);
  };

  // 加载更多事件
  const loadPokemonHandler:() => void = () => {
    setLimit(limit+100)
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <input
          value={pokemonInput}
          type="text"
          placeholder="Enter Pokemon Here"
          className="mt-10 p-2 pl-4 border-blue-500 border-2 w-3/12 text-2xl rounded-full focus:border-yellow-700 transition-all"
          style={{outline:'none'}}
          onChange={pokemonFilterChange}
        />
      </div>
      <Spin spinning={showLoading} size="large">
        <div className="mt-10 p-6 flex flex-wrap">
          {filteredPokemon.length
            ? filteredPokemon.map((item, index) => (
                <div className="ml-4 text-2xl text-blue-400" key={index}>
                  <Link to={`/about/${item.index}`}>{item.name}</Link>
                </div>
              ))
            : pokemon.results.map((item, index) => (
                <div className="ml-4 text-2xl text-blue-400" key={index}>
                  <Link to={`/about/${item.index}`}>{item.name}</Link>
                </div>
              ))
          }
        </div>
        <div className="flex justify-center items-center">
          {
            hideLoadingButton ? <span className="text-4xl m-4 mt-1 text text-purple-700">All pokemons Loaded</span> : <button
            onClick={loadPokemonHandler}
            className="m-4 mt-1 p-4 outline-no text-lg bg-blue-400 rounded-lg border-none text-white"
            >Loading More</button>
          }
        </div>
      </Spin>
    </>
  );
};

export default Home;
