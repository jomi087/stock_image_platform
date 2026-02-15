type Props = {
  title: string;
  children: React.ReactNode;
};

export const AuthLayout = ({ title, children }: Props) => (
  <div className="min-h-screen flex items-center justify-center p-5 bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]">
    <div className="w-full max-w-130 bg-white py-5 px-8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
      <h2 className="mb-5 text-center font-bold text-[28px] text-gray-800 tracking-[-0.5px]">
        {title}
      </h2>

      {children}
    </div>
  </div>
);
