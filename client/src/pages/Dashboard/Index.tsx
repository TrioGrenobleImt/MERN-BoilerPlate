import { Outlet } from "react-router-dom";

export const Index = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
};
