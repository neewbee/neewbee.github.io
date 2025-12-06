export default function Header() {
  return (
    <div className="w-full">
      <ul className="flex flex-row items-center max-w-full justify-evenly dark:text-white text-black my-5">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/experiments/">Experiments</a>
        </li>
        <li>
          <a href="/blog/">blog</a>
        </li>
        <li className="hover:bg-transparent hover:cursor-pointer">
          <a href="/about-me">About Me</a>
        </li>
      </ul>
    </div>
  );
}
