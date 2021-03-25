import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { IAboutRouteParams, IPokemonDisplay } from '../interface';
import { Spin, Image } from 'antd'

const initialPokemon = {
  name:"",
  sprites:[]
}

const About:FC = () => {
  // 从列表页传过来的index
  const { slug } = useParams<IAboutRouteParams>()
  // 单个的宝可梦
  const [ pokemon, setPokemon] = useState<IPokemonDisplay>(initialPokemon)
  // 加载中状态
  const [ showLoading, setShowLoading] = useState<boolean>(true)

  useEffect(()=>{
    fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`)
      .then(res=>res.json())
      .then(data=>{
        console.log(data);

        let images = Object.values(data.sprites).map(value=>{
          if(typeof value === "string"){
            return value
          }
          return null
        })
        data.sprites = images
        setPokemon(data)
      })
  },[slug]);
  return (
    <>
      {pokemon &&
        (
          <Spin spinning={showLoading} size="large">
            <div className="w-full  mb-4 flex justify-center items-center" style={{display:(showLoading?"none":"")}}>
              <h3 className="text-2xl text-green-900 uppercase pt-4">{pokemon.name}</h3>
            </div>
            <div className="flex justify-center flex-wrap flex-row m-auto">
                <Image.PreviewGroup>
                  {
                    pokemon.sprites.map((item,index)=>{
                      if(item){
                        return (<Image
                          src={item}
                          alt={pokemon.name}
                          onLoad={()=>{setShowLoading(false)}}
                          className="mr-2 border-2 border-yellow-200"
                          key={index}
                          width={192}
                        ></Image>)
                      }
                      return null
                    })
                  }
                </Image.PreviewGroup>
            </div>
            <div className="w-full  mb-4 flex justify-center items-center" style={{display:(showLoading?"none":"")}}>
              <h3 className="text-2xl text-green-900 uppercase pt-4">abilities</h3>
            </div>
          </Spin>
        )
      }

    </>
  );
}

export default About;
