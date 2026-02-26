import { APP_NAME } from "../../constants/app_constants";

export const AuthHeader = () => {
  return (
    <header className="h-16 flex items-center px-6 border-b bg-white">
      <h1 className="text-xl font-bold">{APP_NAME}</h1>
    </header>
  );
};
