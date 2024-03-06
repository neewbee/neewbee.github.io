export default function Header() {
  return (
    <div className="w-full">
      <ul className="flex flex-row items-center max-w-full justify-evenly dark:text-white text-black my-5">
        <li className="hover:bg-sky-700">
          <a href="/">Home</a>
        </li>
        <li className="hover:bg-sky-700 hover:cursor-pointer">
          <a href="/experiments">Experiments</a>
        </li>
        <li className="hover:bg-sky-700 hover:cursor-pointer">
          <a href="/blog">blog</a>
        </li>
        <li className="hover:bg-sky-700 hover:cursor-pointer">
          <a href="/about-me">About Me</a>
        </li>
      </ul>
    </div>
  );
}
