type ServerPageProps = {
  params: {
    serverId: string;
  };
};
export default function ServerPage({ params: { serverId } }: ServerPageProps) {
  return (
    <div>
      <h1 className="font-bold text-5xl">{serverId}</h1>
    </div>
  );
}
