import { useEffect, useState, createContext, ReactNode, useContext } from "react";
import { api } from "./services/api";

// Tipagem da lista das categorias dos filmes (Sidebar)
export interface GenreResponseProps {
	id: number;
	name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
	title: string;
  }

// Tipagem da lista de filmes (Content)
export interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export interface Children {
	children: ReactNode;
}

export interface MoviesContextProps {
	genres: GenreResponseProps[];
	movies: MovieProps[];
	selectedGenre: GenreResponseProps; 
	handleClickButton: (id: number) => void;
	selectedGenreId: number;
}

const MoviesContext = createContext<MoviesContextProps>({} as MoviesContextProps)

export function MoviesProvider({ children }: Children) {

    // State usado para armazenar o ID de cada Categoria na Sidebar (Estado tem valor incial de 1, por que é o Id da primeira categoria e ea já deve estar marcada)
	const [selectedGenreId, setSelectedGenreId] = useState(1);

	// State responsável para guardamos a nossa lista de categorias
	const [genres, setGenres] = useState<GenreResponseProps[]>([]);

	// State responsável para guardamos a lista de filmes
	const [movies, setMovies] = useState<MovieProps[]>([]);

	// State responsável por armazenar apenas 1 categoria
	const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

	/* UseEffect responsável para que a lista de categorias (Sidebar) apareça na tela
	depois que o componente for montado */
	useEffect(() => {

		api.get<GenreResponseProps[]>('genres').then(response => {
			setGenres(response.data);
		});

	}, []);

	// UseEffect responsável para que a lista de filmes apareça na tela conforme o Id da categoria
	useEffect(() => {

		// Requisição p/ os filmes apareçam na tela, pelo id da categoria
		api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
			// dai os filmes da url a cima, são armazenadas no State abaixo
			setMovies(response.data);
		});

		// Requisição feita para que o nome da categoria na Header mude dinamicamente 
		api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
			setSelectedGenre(response.data);
		})

	// Queremos que aconteça um efeito na tela toda vez que ocorrer mudança no State - selectedGenreId
	}, [selectedGenreId]);

	/* Função feita para que quando clicarmos no Botão da categoria, o State muda do seu valor
	incial (que é 1) para o Id da categoria que passamos por parâmetro */
	function handleClickButton(id: number) {
		setSelectedGenreId(id);
	}

    return (
		<MoviesContext.Provider value={{selectedGenreId, genres, movies, selectedGenre, handleClickButton}} >
			{children}
		</MoviesContext.Provider>
    )
}

export function useMovies() {
    const context = useContext(MoviesContext)

    return context
}