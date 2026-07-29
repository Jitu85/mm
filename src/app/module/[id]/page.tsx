import ModuleClient from "./ModuleClient";

export function generateStaticParams() {
  return [
    { id: "b" },
    { id: "c" },
    { id: "B" },
    { id: "C" },
  ];
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ModuleClient id={id} />;
}
