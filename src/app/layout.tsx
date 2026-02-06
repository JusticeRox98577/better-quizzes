export const metadata = { title: "Better Quizzes" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", margin: 0 }}>{children}</body>
    </html>
  );
}
