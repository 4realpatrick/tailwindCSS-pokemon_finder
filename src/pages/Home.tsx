import { FC, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { IPokemonListLocal, IPokemonLocal, IPokemon } from "../interface";

// 初始化pokemon,后端数据结构
const initialPokemon = {
  count: 0,
  next: "",
  previcous: "",
  results: [],
};
// 缓存中的pokemon数据(总的)
const pokemonFromSessionstorage = localStorage.getItem('pokemon')

// 宝可梦列表
const Home: FC = () => {
  // 所有宝可梦数据,用于搜索,只会在第一次加载,后面会从localStorage中获取
  const [allPokemon,setAllPokemon] = useState<IPokemonLocal[]>([])
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
  // 获取总的宝可梦数据,有缓存则不会请求,没有缓存只会请求一次,下次直接从缓存读
  useEffect(()=>{
    if(!!pokemonFromSessionstorage){
      console.log('有缓存');
      setAllPokemon(JSON.parse(pokemonFromSessionstorage))
      return
    }
    console.log('无缓存');
    fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1200')
      .then(res => res.json())
      .then(data=>{
        const results = data.results.map((pokemon: IPokemon, index: number) => {
          return { ...pokemon, index: index + 1 };
        });
        setAllPokemon(results);
        localStorage.setItem('pokemon',JSON.stringify(results))
      })
  },[])

  useEffect(() => {
    // 设置加载中
    setShowLoading(true)
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        if(!data.next){
          // 如果没有next属性,证明没有下一个,设置加载更多按钮为隐藏
          setHideLoadingButton(true)
        }
        // 将sprites对象转为数组
        const results = data.results.map((pokemon: IPokemon, index: number) => {
          return { ...pokemon, index: index + 1 };
        });
        // setPokemon
        setPokemon({ ...data, results });
        // 关闭加载中状态
        setShowLoading(false)
      });
  }, [limit]);

  useMemo(() => {
    // 当筛选条件改变时,获取过滤后的列表
    if (pokemonInput.length === 0) {
      setFilteredPokemon(pokemon.results);
      return;
    }
    if (allPokemon) {
      setFilteredPokemon(() =>
        allPokemon.filter(pokemon => pokemon.name.includes(pokemonInput!))
      );
    }
  }, [pokemonInput, allPokemon,pokemon.results]);

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
          {filteredPokemon.length ?
            filteredPokemon.map((item, index) => (
                <div className="ml-4 text-2xl text-blue-400" key={index}>
                  <Link to={`/about/${item.index}`}>{item.name}</Link>
                </div>
              ))
            : <div className="flex justify-center items-center text-4xl text-blue-400 text-center w-full">no such pokemon under this circumstance</div>
          }
        </div>
        <div className="flex justify-center items-center">
          {
            Number(hideLoadingButton) | pokemonInput.length ? <span className="text-4xl m-4 mt-1 text text-purple-700">All pokemons Loaded</span> : <button
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
