import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Developer Chat Application',
  description: 'Great developer community chating application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} storageKey='devchat-theme' >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
