import Manage from "./components/Manage";

export default async function Page() {
  // await new Promise<boolean>((resolve) => {
  //   setTimeout(() => resolve(true), 3000);
  // });
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800">Bandas</h1>
      <Manage></Manage>
    </>
  );
}
