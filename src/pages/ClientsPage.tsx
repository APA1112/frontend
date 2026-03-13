import ClientsGrid from "../components/ClientsGrid";

const ClientPage = () => {
  return (
    <div className="flex">
      <main className="flex-1 md:ml-57.5 ml-15 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <ClientsGrid />
        </div>
      </main>
    </div>
  );
};

export default ClientPage;