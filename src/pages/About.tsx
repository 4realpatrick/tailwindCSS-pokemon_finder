import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { IAboutRouteParams, IPokemonDisplay } from '../interface';
import { Spin, Image, Tooltip } from 'antd'

const initialPokemon = {
  name: "",
  sprites: [],
  abilities: [],
  types: [],
  weight: 0,
  height: 0,
  base_experience: 0,
  stats: []
}

const About: FC = () => {
  // 从列表页传过来的index
  const { slug } = useParams<IAboutRouteParams>()
  // 单个的宝可梦
  const [pokemon, setPokemon] = useState<IPokemonDisplay>(initialPokemon)
  // 加载中状态
  const [showLoading, setShowLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let images = Object.values(data.sprites).map(value => {
          if (typeof value === "string") {
            return value
          }
          return null
        })
        data.sprites = images
        setPokemon(data)
      })
      .catch(error => {
        alert(`failed to fetch
          error:${error}
        `)

      })
  }, [slug]);
  return (
    <>
      {pokemon &&
        (
          <Spin spinning={showLoading} size="large">
            <div className="w-full  mb-4 flex justify-center items-center select-none" style={{ display: (showLoading ? "none" : "") }}>
              <h3 className="text-4xl text-green-900 uppercase pt-4">name : {pokemon.name}</h3>
            </div>
            {/* images */}
            <div className="flex justify-center flex-wrap flex-row select-none">
              <Image.PreviewGroup>
                {
                  pokemon.sprites.map((item, index) => {
                    if (item) {
                      return (
                        <Image
                          src={item}
                          alt={pokemon.name}
                          onLoad={() => { setShowLoading(false) }}
                          className="mr-4 border-2 border-yellow-200"
                          key={index}
                          width={192}
                        ></Image>)
                    }
                    return null
                  })
                }
              </Image.PreviewGroup>
            </div>
            {/* infomations */}
            <div className="w-full  mb-4 flex justify-center flex-col items-center mt-6 select-none" style={{ display: (showLoading ? "none" : "") }}>
              {/* abilities */}
              <h3 className="text-4xl text-green-900 uppercase pt-4">abilities</h3>
              <div className="w-full flex justify-center items-center my-5">
                {
                  pokemon.abilities.map((item, index) =>
                    <Tooltip title={item.is_hidden ? 'Hidden' : 'Not_Hidden'} placement="top" color={item.is_hidden ? 'cyan' : 'green'} key={index} >
                      <span className="text-2xl text-white cursor-pointer rounded-2xl bg-yellow-500 py-2 ml-2 px-4 hover:bg-blue-400">{item.ability.name}</span>
                    </Tooltip>
                  )
                }
              </div>
              {/* types */}
              <h3 className="text-4xl text-green-900 uppercase mb-4">types</h3>
              <div className="w-full flex justify-center items-center mb-4">
                {
                  pokemon.types.map((item, index) =>
                    <span className="text-2xl text-white cursor-pointer rounded-2xl bg-yellow-500 py-2 ml-2 px-4 hover:bg-blue-400" key={index}>{item.type.name}</span>
                  )
                }
              </div>
              {/* default attributes */}
              <h3 className="text-4xl text-green-900 uppercase">default attributes</h3>
              <table className="border-collapse text-2xl text-green-900 mt-4 text-center mb-10 border uppercase">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-3">base experience</th>
                    <th className="border p-3">height</th>
                    <th className="border p-3">weight</th>
                    {
                      pokemon.stats.map((item, index) =>
                        <th className="border p-3" key={index}>{item.stat.name}</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="border p-3">{pokemon.base_experience}</th>
                    <th className="border p-3">{pokemon.height}</th>
                    <th className="border p-3">{pokemon.weight}</th>
                    {
                      pokemon.stats.map((item, index) =>
                        <th className="border p-3" key={index}>{item.base_stat}</th>
                      )
                    }
                  </tr>
                </tbody>
              </table>
            </div>

          </Spin>
        )
      }

    </>
  );
}

export default About;
