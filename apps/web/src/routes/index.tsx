import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/")({
  loader: () => getData(),
  component: Home,
});

const getData = createServerFn().handler(() => {
  return {
    message: `Running in ${navigator.userAgent}`,
  };
});

function Home() {
  const data = Route.useLoaderData();

  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
      <p>{data.message}</p>
    </div>
  );
}
