import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

function DashboardLayout({
  title,
  page,
  setPage,
  children
}) {
  return (
    <>
      <Sidebar
        active={page}
        onNav={setPage}
      />

      <TopNav title={title} />

      {children}
    </>
  );
}

export default DashboardLayout;