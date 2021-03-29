export interface IPokemon{
  name:string
  url:string
}

export interface IPokemonLocal{
  name:string
  url:string
  index:number
}

export interface IPokemonListLocal{
  count:number
  next:string
  previcous:string | null
  results:IPokemonLocal[]
}

export interface IPokemonList{
  count:number
  next:string
  previcous:string | null
  results:IPokemon[]
}

export interface IAboutRouteParams{
  slug:string
}

export interface IPokemonDisplay{
  name:string
  sprites:any[]
  abilities:any[]
}