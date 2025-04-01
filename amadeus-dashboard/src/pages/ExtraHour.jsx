import Header from "../components/Header";

const ExtraHour = () => {
    return (
        <>
        <div className="min-h-full">
        <Header></Header>
          <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Extra Hours</h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                Your content Extra Hours
            </div>
          </main>
        </div>
      </>
    )
}

export default ExtraHour;