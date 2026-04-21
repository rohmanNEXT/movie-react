import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

type MovieCardProps = {
  movie: {
    id: string | number;
    title: string;
    image: string;
    rating: number;
    category?: string;
    isNewEpisode?: boolean;
  };
  isWide?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isWide }) => {
  const [imgSrc, setImgSrc] = React.useState(movie.image);

  return (
    <Link to={`/movie/${movie.id}`}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className={`relative group cursor-pointer ${
          isWide ? "aspect-video" : "aspect-[2/3]"
        } rounded-2xl overflow-hidden apple-shadow`}
      >
        <img
          src={imgSrc}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(`https://picsum.photos/seed/${movie.title.replace(/\s/g, '')}/500/750`)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
          <h3 className="text-white/80 font-semibold text-sm mb-1">{movie.title}</h3>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-medium text-white">{movie.rating}/5</span>
          </div>
        </div>

        {movie.isNewEpisode && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-purple-600 text-[10px] font-semibold text-white/80 rounded-md uppercase tracking-wider">
            Episode Baru
          </div>
        )}
      </motion.div>
    </Link>
  );
};

export default MovieCard;
