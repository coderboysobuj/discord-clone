export default function AuthLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <section className="h-full w-full items-center justify-center">
      {children}
    </section>
  )
}
