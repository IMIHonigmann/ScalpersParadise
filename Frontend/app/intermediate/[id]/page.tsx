export default function IntermediatePage({
  params,
}: {
  params: { id: string };
}) {
  return <div>{params.id}</div>;
}
