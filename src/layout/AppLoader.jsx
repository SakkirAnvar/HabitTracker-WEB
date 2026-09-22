import { AVEN_LOGO } from "../utils/constants";

const AppLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100">
      <div className="flex flex-col items-center gap-3">
        <img
          src={AVEN_LOGO}
          alt="Aven"
          className="h-12 w-auto"
        />

        <span className="loading loading-dots loading-sm text-primary" />
      </div>
    </div>
  );
};

export default AppLoading