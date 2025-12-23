export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "system-ui" }}>
      <h1>Kalidate</h1>
      <p>Send calendar requests. Get confirmed.</p>

      <form style={{ marginTop: "30px", maxWidth: "400px" }}>
        <label>
          Your email
          <input
            type="email"
            placeholder="you@email.com"
            style={{ display: "block", width: "100%", marginTop: "8px", marginBottom: "16px" }}
          />
        </label>

        <label>
          Receiver email
          <input
            type="email"
            placeholder="receiver@email.com"
            style={{ display: "block", width: "100%", marginTop: "8px", marginBottom: "16px" }}
          />
        </label>

        <button type="submit">Send event request</button>
      </form>
    </main>
  );
}