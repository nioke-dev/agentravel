import { LoginForm } from '@/components/views/login-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#377dec]">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          <img src="../img/logo.svg" alt="logo-aplikasi" className="w-12 h-12" />
          <span className="text-white text-3xl font-bold">SITRAVEL</span>
        </div>
      </div>
      <LoginForm />
    </main>
  );
}