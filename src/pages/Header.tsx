import { Link } from 'react-router-dom'


const Header = () => {
  return (
    <div className="p-14">
      <div className="flex flex-col items-center">
        <Link to="/">
          <header className="text-8xl text-yellow-700 hover:text-red-600 transition-all font-mono">
            Pokemon picker
          </header>
        </Link>
      </div>
    </div>
  );
}

export default Header;
