export default function Header() {
  return (
    <div>
      <ul className="flex flex-row items-center max-w-full justify-evenly text-white my-5">
        <li className="hover:text-white ">Home</li>
        <li className="hover:bg-sky-700 ">Experiments</li>
        <li className="hover:bg-sky-700  ">blogs</li>
        <li className="hover:bg-sky-700  ">About Me</li>
      </ul>
    </div>
  );
}
