import ClientsGrid from "../components/ClientsGrid";

function ClientsPage() {
  return (
    <div className="w-full flex justify-center p-2">
      <div className="max-w-full overflow-hidden">
        <ClientsGrid />
      </div>
    </div>
  );
}

export default ClientsPage;
