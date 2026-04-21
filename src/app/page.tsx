import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getData } from '@/store/feature/movie';
import type { Movie } from '@/store/feature/movie';

const LandingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { movies, myList, loading } = useAppSelector((state) => state.movies);
  const myMovies = movies.filter((m: Movie) => myList.includes(m.id));

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(getData());
    }
  }, [dispatch, movies.length]);

  if (loading || movies.length === 0) return null;

  const heroMovies = movies.filter((m: Movie) => 
    ['Duty After School', 'Squid Game', 'Money Heist', 'All of Us Are Dead'].includes(m.title)
  );

  return (
    <main className="min-h-screen bg-[#0f172a] mb-20">
      <Navbar />
      <Hero 
        movies={heroMovies.length > 0 ? heroMovies : [movies[0]]} 
      />
      
      <div className="relative mt-24 md:mt-32 z-10 space-y-6 md:space-y-10">
        <div id="series" className="scroll-mt-24">
          <MovieRow title="Series Populer" movies={movies.filter((m: Movie) => m.category === 'Series').slice(0, 10)} />
        </div>
        
        <div id="rilis-baru" className="scroll-mt-24">
          <MovieRow title="Rilis Baru" movies={movies.filter((m: Movie) => m.isNewEpisode).slice(0, 8)} />
        </div>

        {myMovies.length > 0 && (
          <div id="daftar-saya" className="scroll-mt-24">
            <MovieRow title="Daftar Saya" movies={myMovies} />
          </div>
        )}
        
        <MovieRow title="Trending Sekarang" movies={movies.slice(2, 10)} />
      </div>
    </main>
  );
};

export default LandingPage;
