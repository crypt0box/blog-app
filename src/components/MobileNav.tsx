import { useRef } from "react";
import { siteConfig } from "../config";

export const MobileNav = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <>
      <button className="sm:hidden absolute right-4" onClick={openDialog}>
        <svg
          className="fill-slate-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
        >
          <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0)]"
        onClick={closeDialog}
      >
        <nav
          className="sm:hidden absolute right-2 top-10 p-3 animate-in slide-in-from-top-10 bg-slate-100 rounded-xl shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <ul>
            {siteConfig.menu.map((item) => (
              <li className="text-slate-500 font-bold py-1">
                {item.isExternal ? (
                  <a
                    className="flex gap-1 w-full"
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.name}
                    <svg
                      className="fill-slate-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24px"
                      height="24px"
                    >
                      <path d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z" />
                    </svg>
                  </a>
                ) : (
                  <a className="block w-full" href={item.to}>
                    {item.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  );
};
