export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-100 bg-zinc-950">
      {children}
    </div>
  );
}
