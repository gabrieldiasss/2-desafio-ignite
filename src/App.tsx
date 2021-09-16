import { useEffect, useState } from 'react';
import { api } from './services/api';
import { MovieCard } from './components/MovieCard';
import { Button } from './components/Button';

import { SideBar } from './components/SideBar';
import { Content } from './components/Content';

import './styles/global.scss';

import './styles/sidebar.scss';
import './styles/content.scss';
import { MoviesProvider } from './MoviesProvider';

export function App() {

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
		<MoviesProvider>
			<SideBar />
			<Content />
		</MoviesProvider>
		
    </div>
  )
}